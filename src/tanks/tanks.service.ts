import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { getArmyById } from "../armies/armies.service";
import pool from "../db";
import { getUserById } from "../users/users.service";
import { TanksCreateSchema, Tank } from "./types/tanks.interfaces";

export async function getTanks(): Promise<Tank[]> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM tanks";

    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getTankById(id: string): Promise<Tank> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM tanks WHERE id = $1";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `tank with id:${id} not found`
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

export async function postTank(newTank: TanksCreateSchema): Promise<Tank> {
  const client = await pool.connect();

  try {
    const { name, strength, fuel_req } = newTank;

    const query = {
      text: "INSERT INTO tanks (name, strength, fuel_req, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
      values: [name, strength, fuel_req],
    };

    const existingTank = await client.query(
      "SELECT * FROM tanks WHERE name = $1",
      [name]
    );
    if (existingTank.rows.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `Tank with that name ${name} already registered`
      );
    }
    const result = await client.query(query);

    if (result.rows.length > 0) {
      console.log(result.rows[0]);
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Tank creation failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function updateTank(
  id: string,
  updateData: Partial<TanksCreateSchema>
): Promise<Tank> {
  const client = await pool.connect();
  const { name, strength, fuel_req } = updateData;
  const values: any[] = [id];

  let arrayWithChanges = [];
  if (name) {
    arrayWithChanges.push(`name=$${values.push(name)}`);
  }
  if (strength) {
    arrayWithChanges.push(`strength=$${values.push(strength)}`);
  }
  if (fuel_req) {
    arrayWithChanges.push(`fuel_req=$${values.push(fuel_req)}`);
  }

  const changes = arrayWithChanges.join(", ");

  const queryUpd = `UPDATE tanks SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    if (arrayWithChanges.length === 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "No valid fields provided for update"
      );
    }

    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0)
      throw new HttpException(HttpStatusCode.NOT_FOUND, "tank not found");

    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteTank(id: string): Promise<Tank> {
  const client = await pool.connect();

  try {
    let query = "DELETE FROM tanks WHERE id=$1;";
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

export async function assignTankToArmy(
  tankId: string,
  armyId: string
): Promise<Tank> {
  const client = await pool.connect();

  try {
    const tank = await getTankById(tankId);
    if (!tank) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Tank not found");
    }
    const army = await getArmyById(armyId);
    if (!army) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Army not found");
    }


    const assignQuery = {
      text: "UPDATE tanks SET army_id = $1 WHERE id = $2 RETURNING *",
      values: [armyId, tankId],
    };

    const result = await client.query(assignQuery);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Assigning tank to army failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}
