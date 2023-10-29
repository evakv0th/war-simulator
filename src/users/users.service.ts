import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { UserCreateSchema, User } from "../auth/types/auth.interfaces";
import pool from "../db";

export async function getUsers(queryParameters?: any): Promise<User[]> {
  const client = await pool.connect();

  try {
    const { name } = queryParameters;

    let query = "SELECT * FROM users";
    const values = [];

    if (name) {
      query += " WHERE name = $1";
      values.push(name);
    }

    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getUserById(id: string): Promise<User> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM users WHERE id = $1";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);
    if (result.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `user with id:${id} not found`
      );
    }
    let queryArmy = "SELECT * FROM armies WHERE user_id = $1";
    const army = await client.query(queryArmy, [id]);
    return { ...result.rows[0], army: army.rows[0] };
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function updateUser(
  id: string,
  updateData: Partial<UserCreateSchema>
): Promise<User> {
  const client = await pool.connect();
  const { name, password, email } = updateData;
  const values = [id];

  let arrayWithChanges = [];
  if (name) {
    arrayWithChanges.push(`name=$${values.push(name)}`);
  }
  if (email) {
    arrayWithChanges.push(`email=$${values.push(email)}`);
  }
  if (password) {
    arrayWithChanges.push(`password=$${values.push(password)}`);
  }

  const changes = arrayWithChanges.join(", ");

  const queryUpd = `UPDATE users SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    if (arrayWithChanges.length === 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "No valid fields provided for update"
      );
    }

    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0)
      throw new HttpException(HttpStatusCode.NOT_FOUND, "user not found");

    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteUser(id: string): Promise<User> {
  const client = await pool.connect();

  try {
    let query = "DELETE FROM users WHERE id=$1;";
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

export async function battle(id: string, enemyId: string) {
  const client = await pool.connect();
  console.log(enemyId);
  try {
    const resultUser = await client.query(
      "SELECT * FROM armies WHERE user_id=$1",
      [id]
    );
    if (resultUser.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        "you do not have army yet"
      );
    }
    const army = resultUser.rows[0];
    console.log(army, "your army");
    const resultUserEnemy = await client.query(
      "SELECT * FROM armies WHERE user_id=$1",
      [enemyId]
    );
    if (resultUserEnemy.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        "your enemy does not have army yet"
      );
    }
    const armyEnemy = resultUserEnemy.rows[0];
    console.log(armyEnemy, "enemy army");

    const armyTanksQ = await client.query(
      "SELECT SUM(strength) FROM tanks WHERE army_id = $1",
      [id]
    );
    const armyTanksStrength = armyTanksQ.rows[0].sum || 0;
    const armyTanksEnemyQ = await client.query(
      "SELECT SUM(strength) FROM tanks WHERE army_id = $1",
      [enemyId]
    );
    const armyTanksEnemyStrength = armyTanksEnemyQ.rows[0].sum || 0;

    console.log(armyTanksStrength, "str of your tanks");
    console.log(armyTanksEnemyStrength, "str of enemy tanks");

    const armyPlanesQAir = await client.query(
      "SELECT SUM(air_strength) FROM planes WHERE army_id = $1",
      [id]
    );
    const armyPlanesStrengthAir = armyPlanesQAir.rows[0].sum || 0;
    const armyPlanesEnemyQAir = await client.query(
      "SELECT SUM(air_strength) FROM planes WHERE army_id = $1",
      [enemyId]
    );
    const armyPlanesEnemyStrengthAir = armyPlanesEnemyQAir.rows[0].sum || 0;

    console.log(armyPlanesStrengthAir, "str of your planes air");
    console.log(armyPlanesEnemyStrengthAir, "str of enemy planes air");

    const armyPlanesQSurface = await client.query(
      "SELECT SUM(surface_strength) FROM planes WHERE army_id = $1",
      [id]
    );
    const armyPlanesStrengthSurface = armyPlanesQSurface.rows[0].sum || 0;
    const armyPlanesEnemyQSurface = await client.query(
      "SELECT SUM(surface_strength) FROM planes WHERE army_id = $1",
      [enemyId]
    );
    const armyPlanesEnemyStrengthSurface =
      armyPlanesEnemyQSurface.rows[0].sum || 0;

    console.log(armyPlanesStrengthSurface, "str of your planes surface");
    console.log(armyPlanesEnemyStrengthSurface, "str of enemy planes surface");
    const totalSquadStrengthQuery = `SELECT SUM(weapons.strength)
        FROM squads
        JOIN squads_weapons ON squads.id = squads_weapons.squad_id
        JOIN weapons ON squads_weapons.weapon_id = weapons.id
        WHERE squads.army_id = $1`;

    const armySquadsQ = await client.query(totalSquadStrengthQuery, [id]);
    const armySquadsStrength = armySquadsQ.rows[0].sum || 0;
    const armySquadsEnemyQ = await client.query(totalSquadStrengthQuery, [
      enemyId,
    ]);
    const armySquadsEnemyStrength = armySquadsEnemyQ.rows[0].sum || 0;

    console.log(armySquadsStrength, "str of your squad");
    console.log(armySquadsEnemyStrength, "str of enemy squad");

    return 0;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}
