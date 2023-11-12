import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { getArmyById } from "../armies/armies.service";
import pool from "../application/db/db";
import { SquadsCreateSchema, Squad } from "./types/squads.interfaces";

export async function getSquads(): Promise<Squad[]> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM squads";

    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function getSquadById(id: string): Promise<Squad> {
  const client = await pool.connect();

  try {
    let query = `SELECT * FROM squads WHERE squads.id = $1;`;
    const values = [id];
    const result = await client.query(query, values);

    if (result.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `squad with id:${id} not found`
      );
    }
    let queryWeapons = `SELECT weapons.name, weapons.strength, weapons.bullets_req
    FROM weapons
    JOIN squads_weapons ON weapons.id = squads_weapons.weapon_id
    WHERE squads_weapons.squad_id = $1;`;
    const weaponsResult = await client.query(queryWeapons, values);
    const weapons = weaponsResult.rows;
    const weaponsArray = weapons.map((weapon) => ({
      name: weapon.name,
      strength: weapon.strength,
      bullets_req: weapon.bullets_req,
    }));
    const squad = result.rows[0];
    squad.weapons = weaponsArray;

    return squad;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function postSquad(newSquad: SquadsCreateSchema): Promise<Squad> {
  const client = await pool.connect();

  try {
    const { name } = newSquad;

    const query = {
      text: "INSERT INTO squads (name, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *",
      values: [name],
    };

    const existingSquad = await client.query(
      "SELECT * FROM squads WHERE name = $1",
      [name]
    );
    if (existingSquad.rows.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `Squad with that name ${name} already registered`
      );
    }
    const result = await client.query(query);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Squad creation failed"
      );
    }
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function updateSquad(
  id: string,
  updateData: Partial<SquadsCreateSchema>
): Promise<Squad> {
  const client = await pool.connect();
  const { name } = updateData;
  const values: any[] = [id];

  let arrayWithChanges = [];
  if (name) {
    arrayWithChanges.push(`name=$${values.push(name)}`);
  } else {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "No valid fields provided for update"
    );
  }

  const changes = arrayWithChanges.join(", ");

  const queryUpd = `UPDATE squads SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0)
      throw new HttpException(HttpStatusCode.NOT_FOUND, "squad not found");

    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteSquad(id: string): Promise<Squad> {
  const client = await pool.connect();

  try {
    const deleteRelationsQuery =
      "DELETE FROM squads_weapons WHERE squad_id = $1;";
    const values = [id];
    await client.query(deleteRelationsQuery, values);

    let query = "DELETE FROM squads WHERE id=$1;";
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function assignSquadToArmy(
  squadId: string,
  armyId: string
): Promise<Squad> {
  const client = await pool.connect();

  try {
    const squad = await getSquadById(squadId);
    if (!squad) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "squad not found");
    }
    const army = await getArmyById(armyId);
    if (!army) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Army not found");
    }

    const queryWeapons = {
      text: "SELECT weapons.bullets_req FROM squads_weapons JOIN weapons ON squads_weapons.weapon_id = weapons.id WHERE squads_weapons.squad_id = $1",
      values: [squadId],
    };

    const weaponsResult = await client.query(queryWeapons);
    const totalBulletsReq = weaponsResult.rows.reduce(
      (total, weapon) => total + weapon.bullets_req,
      0
    );

    const querySquadsInArmy = {
      text: "SELECT squads_weapons.squad_id, weapons.bullets_req FROM squads_weapons JOIN weapons ON squads_weapons.weapon_id = weapons.id WHERE squads_weapons.squad_id IN (SELECT id FROM squads WHERE army_id = $1)",
      values: [armyId],
    };

    const squadsInArmyResult = await client.query(querySquadsInArmy);
    const totalBulletsReqInArmy = squadsInArmyResult.rows.reduce(
      (total, row) => total + row.bullets_req,
      0
    );

    if (army.bullets_amount - (totalBulletsReq + totalBulletsReqInArmy) < 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Assigning squad would exceed bullets_amount limit"
      );
    }

    const assignQuery = {
      text: "UPDATE squads SET army_id = $1 WHERE id = $2 RETURNING *",
      values: [armyId, squadId],
    };

    const result = await client.query(assignQuery);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Assigning squad to army failed"
      );
    }
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function removeSquadFromArmy(id: string): Promise<Squad> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM squads WHERE id = $1";
    const values = [id];
    const squad = await client.query(query, values);
    if (squad.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `squad with id:${id} not found`
      );
    }
    let queryToRemove =
      "UPDATE squads SET army_id = null WHERE id=$1 RETURNING *";
    const result = await client.query(queryToRemove, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}
