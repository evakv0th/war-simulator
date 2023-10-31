import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import pool from "../application/db/db";
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
    const queryTanks = `SELECT * FROM tanks WHERE army_id = $1`;
    const tanksRes = await client.query(queryTanks, values);
    const tanks = tanksRes.rows;
    const queryPlanes = `SELECT * FROM planes WHERE army_id = $1`;
    const planesRes = await client.query(queryPlanes, values);
    const planes = planesRes.rows;
    const querySquads = `
    SELECT squads.id, squads.name, ARRAY_AGG(json_build_object(
      'name', weapons.name,
      'strength', weapons.strength,
      'bullets_req', weapons.bullets_req
    )) AS weapons
    FROM squads
    LEFT JOIN squads_weapons ON squads.id = squads_weapons.squad_id
    LEFT JOIN weapons ON squads_weapons.weapon_id = weapons.id
    WHERE squads.army_id = $1
    GROUP BY squads.id, squads.name;
  `;
    const squadsResult = await client.query(querySquads, values);
    const squads = squadsResult.rows;

    return {
      ...result.rows[0],
      tanks,
      planes,
      squads,
    };
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
        `Army with that name ${name} already registered`
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
    arrayWithChanges.push(`advantage=$${values.push(advantage)}`);
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
    let query = "UPDATE planes SET army_id = NULL WHERE army_id = $1";
    const values = [id];
    await client.query(query, values);

    query = "UPDATE tanks SET army_id = NULL WHERE army_id = $1";
    await client.query(query, values);

    query = "UPDATE squads SET army_id = NULL WHERE army_id = $1";
    await client.query(query, values);

    query = "DELETE FROM armies WHERE id = $1";
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
