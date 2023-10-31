import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { getArmyById } from "../armies/armies.service";
import pool from "../application/db/db";
import { PlanesCreateSchema, Plane } from "./types/planes.interfaces";

export async function getPlanes(): Promise<Plane[]> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM planes";

    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getPlaneById(id: string): Promise<Plane> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM planes WHERE id = $1";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `plane with id:${id} not found`
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

export async function postPlane(newPlane: PlanesCreateSchema): Promise<Plane> {
  const client = await pool.connect();

  try {
    const { name, air_strength, surface_strength, fuel_req } = newPlane;

    const query = {
      text: "INSERT INTO planes (name, air_strength, surface_strength, fuel_req, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *",
      values: [name, air_strength, surface_strength, fuel_req],
    };

    const existingPlane = await client.query(
      "SELECT * FROM planes WHERE name = $1",
      [name]
    );
    if (existingPlane.rows.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `Plane with that name ${name} already registered`
      );
    }
    const result = await client.query(query);

    if (result.rows.length > 0) {
      console.log(result.rows[0]);
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Plane creation failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function updatePlane(
  id: string,
  updateData: Partial<PlanesCreateSchema>
): Promise<Plane> {
  const client = await pool.connect();
  const { name, air_strength, surface_strength, fuel_req } = updateData;
  const values: any[] = [id];

  let arrayWithChanges = [];
  if (name) {
    arrayWithChanges.push(`name=$${values.push(name)}`);
  }
  if (air_strength) {
    arrayWithChanges.push(`air_strength=$${values.push(air_strength)}`);
  }
  if (surface_strength) {
    arrayWithChanges.push(`surface_strength=$${values.push(surface_strength)}`);
  }
  if (fuel_req) {
    arrayWithChanges.push(`fuel_req=$${values.push(fuel_req)}`);
  }

  const changes = arrayWithChanges.join(", ");

  const queryUpd = `UPDATE planes SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    if (arrayWithChanges.length === 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "No valid fields provided for update"
      );
    }

    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0)
      throw new HttpException(HttpStatusCode.NOT_FOUND, "plane not found");

    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deletePlane(id: string): Promise<Plane> {
  const client = await pool.connect();

  try {
    let query = "DELETE FROM planes WHERE id=$1;";
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

export async function assignPlaneToArmy(
  planeId: string,
  armyId: string
): Promise<Plane> {
  const client = await pool.connect();

  try {
    const plane = await getPlaneById(planeId);
    if (!plane) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Plane not found");
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
    const remainingFuelCapacity =
      army.fuel_amount - plane.fuel_req - fuelAtArmy;

    if (remainingFuelCapacity < 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `Not enough fuel capacity in the army to add the tank (fuel_amount=${army.fuel_amount}, fuel already in use by other tech=${fuelAtArmy}, tank fuel_req=${plane.fuel_req})`
      );
    }

    const assignQuery = {
      text: "UPDATE planes SET army_id = $1 WHERE id = $2 RETURNING *",
      values: [armyId, planeId],
    };

    const result = await client.query(assignQuery);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Assigning plane to army failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}


export async function removePlaneFromArmy(id: string): Promise<Plane> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM planes WHERE id = $1";
    const values = [id];
    const plane = await client.query(query, values);
    if (plane.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `plane with id:${id} not found`
      );
    }
    let queryToRemove =
      "UPDATE planes SET army_id = null WHERE id=$1 RETURNING *";
    const result = await client.query(queryToRemove, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}
