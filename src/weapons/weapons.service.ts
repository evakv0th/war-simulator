import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { getArmyById } from "../armies/armies.service";
import pool from "../db";
import { getSquadById } from "../squads/squads.service";
import { WeaponsCreateSchema, Weapon } from "./types/weapons.interfaces";

export async function getWeapons(): Promise<Weapon[]> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM weapons";

    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getWeaponById(id: string): Promise<Weapon> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM weapons WHERE id = $1";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);

    if (result.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `weapon with id:${id} not found`
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

export async function postWeapon(
  newWeapon: WeaponsCreateSchema
): Promise<Weapon> {
  const client = await pool.connect();

  try {
    const { name, strength, bullets_req } = newWeapon;

    const query = {
      text: "INSERT INTO weapons (name, strength, bullets_req, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
      values: [name, strength, bullets_req],
    };

    const existingWeapon = await client.query(
      "SELECT * FROM weapons WHERE name = $1",
      [name]
    );
    if (existingWeapon.rows.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `Weapon with that name ${name} already registered`
      );
    }
    const result = await client.query(query);

    if (result.rows.length > 0) {
      console.log(result.rows[0]);
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Weapomn creation failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function updateWeapon(
  id: string,
  updateData: Partial<WeaponsCreateSchema>
): Promise<Weapon> {
  const client = await pool.connect();
  const { name, strength, bullets_req } = updateData;
  const values: any[] = [id];

  let arrayWithChanges = [];
  if (name) {
    arrayWithChanges.push(`name=$${values.push(name)}`);
  }
  if (strength) {
    arrayWithChanges.push(`strength=$${values.push(strength)}`);
  }
  if (bullets_req) {
    arrayWithChanges.push(`bullets_req=$${values.push(bullets_req)}`);
  }

  const changes = arrayWithChanges.join(", ");

  const queryUpd = `UPDATE weapons SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    if (arrayWithChanges.length === 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "No valid fields provided for update"
      );
    }

    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0)
      throw new HttpException(HttpStatusCode.NOT_FOUND, "weapon not found");

    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteWeapon(id: string): Promise<Weapon> {
  const client = await pool.connect();

  try {
    const deleteRelationsQuery =
      "DELETE FROM squads_weapons WHERE weapon_id = $1;";
    const values = [id];
    await client.query(deleteRelationsQuery, values);
    let query = "DELETE FROM weapons WHERE id=$1;";
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function assignWeaponToSquad(
  weaponId: string,
  squadId: string
): Promise<Weapon> {
  const client = await pool.connect();

  try {
    const weapon = await getWeaponById(weaponId);
    if (!weapon) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "weapon not found");
    }
    const squad = await getSquadById(squadId);
    if (!squad) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "squad not found");
    }

    const existingAssignment = await client.query(
      "SELECT * FROM squads_weapons WHERE squad_id = $1 AND weapon_id = $2",
      [squadId, weaponId]
    );

    if (existingAssignment.rows.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Weapon is already assigned to the squad"
      );
    }

    const result = await client.query(
      "INSERT INTO squads_weapons (squad_id, weapon_id) VALUES ($1, $2) RETURNING *",
      [squadId, weaponId]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Assigning weapon to squad failed"
      );
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function removeWeaponFromSquad(
  weaponId: string,
  squadId: string
): Promise<void> {
  const client = await pool.connect();

  try {
    const weapon = await getWeaponById(weaponId);
    if (!weapon) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Weapon not found");
    }

    const squad = await getSquadById(squadId);
    if (!squad) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Squad not found");
    }

    const existingAssignment = await client.query(
      "SELECT * FROM squads_weapons WHERE squad_id = $1 AND weapon_id = $2",
      [squadId, weaponId]
    );

    if (existingAssignment.rows.length === 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Weapon is not assigned to the squad"
      );
    }

    await client.query(
      "DELETE FROM squads_weapons WHERE squad_id = $1 AND weapon_id = $2",
      [squadId, weaponId]
    );
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}
