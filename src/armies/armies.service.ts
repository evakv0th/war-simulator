import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import pool from "../db";
import { getUserById } from "../users/users.service";
import { ArmiesCreateSchema, Army } from "./types/armies.interfaces";

export async function getArmies(): Promise<Army[]> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM armies";

    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getArmyById(id: string): Promise<Army> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM armies WHERE id = $1";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `army with id:${id} not found`
      );
    }
    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function postArmy(newArmy: ArmiesCreateSchema): Promise<Army> {
  const client = await pool.connect();

  try {
    const { name, advantage, fuel_amount, bullets_amount } = newArmy;

    const query = {
      text: "INSERT INTO armies (name, advantage, fuel_amount, bullets_amount, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *",
      values: [name, advantage, fuel_amount, bullets_amount],
    };

    const existingArmy = await client.query(
      "SELECT * FROM armies WHERE name = $1",
      [name]
    );
    if (existingArmy.rows.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Army with that name already registered"
      );
    }
    const result = await client.query(query);

    if (result.rows.length > 0) {
      console.log(result.rows[0]);
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Army creation failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function updateArmy(
  id: string,
  updateData: Partial<ArmiesCreateSchema>
): Promise<Army> {
  const client = await pool.connect();
  const { name, advantage, fuel_amount, bullets_amount } = updateData;
  const values: any[] = [id];

  let arrayWithChanges = [];
  if (name) {
    arrayWithChanges.push(`name=$${values.push(name)}`);
  }
  if (advantage) {
    arrayWithChanges.push(`email=$${values.push(advantage)}`);
  }
  if (fuel_amount) {
    arrayWithChanges.push(`fuel_amount=$${values.push(fuel_amount)}`);
  }
  if (bullets_amount) {
    arrayWithChanges.push(`bullets_amount=$${values.push(bullets_amount)}`);
  }

  const changes = arrayWithChanges.join(", ");

  const queryUpd = `UPDATE armies SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    if (arrayWithChanges.length === 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "No valid fields provided for update"
      );
    }

    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0)
      throw new HttpException(HttpStatusCode.NOT_FOUND, "army not found");

    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteArmy(id: string): Promise<Army> {
  const client = await pool.connect();

  try {
    let query = "DELETE FROM armies WHERE id=$1;";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function assignArmyToUser(
  armyId: string,
  userId: string
): Promise<Army> {
  const client = await pool.connect();

  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "User not found");
    }

    const army = await getArmyById(armyId);
    if (!army) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Army not found");
    }

    const assignQuery = {
      text: "UPDATE armies SET user_id = $1 WHERE id = $2 RETURNING *",
      values: [userId, armyId],
    };

    const result = await client.query(assignQuery);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Assigning army to user failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}
