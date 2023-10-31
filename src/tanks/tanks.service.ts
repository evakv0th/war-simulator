import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { getArmyById } from "../armies/armies.service";
import pool from "../application/db/db";
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

    const fuelAlreadyAtArmy = await client.query(
      `SELECT SUM(fuel_req) as total_fuel_req
      FROM (
        SELECT fuel_req FROM tanks WHERE army_id = $1
        UNION ALL
        SELECT fuel_req FROM planes WHERE army_id = $1
      ) as combined_fuel_req`,
      [armyId]
    );
    const fuelAtArmy = fuelAlreadyAtArmy.rows[0].total_fuel_req;
    console.log(fuelAtArmy);
    const remainingFuelCapacity = army.fuel_amount - tank.fuel_req - fuelAtArmy;

    if (remainingFuelCapacity < 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `Not enough fuel capacity in the army to add the tank (fuel_amount=${army.fuel_amount}, fuel already in use by other tech=${fuelAtArmy}, tank fuel_req=${tank.fuel_req})`
      );
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

export async function removeTankFromArmy(id: string): Promise<Tank> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM tanks WHERE id = $1";
    const values = [id];
    const tank = await client.query(query, values);
    if (tank.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `tank with id:${id} not found`
      );
    }
    let queryToRemove =
      "UPDATE tanks SET army_id = null WHERE id=$1 RETURNING *";
    const result = await client.query(queryToRemove, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

