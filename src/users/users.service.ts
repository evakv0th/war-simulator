import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { BattleState } from "../application/utils/battle-state";
import { UserCreateSchema, User } from "../auth/types/auth.interfaces";
import pool from "../application/db/db";

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
  const { name, password, email, type } = updateData;
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
  if (type) {
    arrayWithChanges.push(`type=$${values.push(type)}`);
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
  if (battleTracker.getState() !== "not_started") {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "please finish your last battle before starting new one"
    );
  } else if (id === enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "You cannot fight yourself"
    );
  }
  const client = await pool.connect();
  try {
    const battleStats = await showStats(id, enemyId);

    if (
      battleStats.yourStats.yourPlanesAirStrength === 0 ||
      battleStats.yourStats.yourTanksStrength === 0 ||
      battleStats.yourStats.yourSquadsStrength === 0
    ) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "You cant start battle, you should have at least 1 squad(with weapons!!), 1 tank and 1 plane"
      );
    }
    if (
      battleStats.enemyStats.enemyPlanesAirStrength === 0 ||
      battleStats.enemyStats.enemyTanksStrength === 0 ||
      battleStats.enemyStats.enemySquadsStrength === 0
    ) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "You cant start battle, your enemy should have at least 1 tank, 1 plane and 1 squad (with weapons!!)"
      );
    }
    battleTracker.startBattle();
    battleTracker.setEnemyId(enemyId);
    return {
      msg: "the battle has started! These are stats of you and your enemy (with advantages included in numbers).",
      msg2: `You can use endpoint /battle/${enemyId}/airBattle to continue the battle and start Air stage.`,
      battleStats: await battleStats,
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function airBattle(id: string, enemyId: string) {
  console.log(battleTracker.getEnemyId());
  if (battleTracker.getState() !== "in_progress") {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "please start battle first"
    );
  } else if (battleTracker.getEnemyId() !== enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `wrong id of an enemy, you've started battle with user id:${battleTracker.getEnemyId()}`
    );
  } else if (id === enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "You cannot fight yourself"
    );
  }
  const client = await pool.connect();
  try {
    const battleStats = await showStats(id, enemyId);

    if (
      battleStats.yourStats.yourPlanesAirStrength >
      battleStats.enemyStats.enemyPlanesAirStrength
    ) {
      battleTracker.winAirBattle();
      return {
        msg: `You won the air battle! Continue battle with /battle/${enemyId}/surfaceBattle`,
        airBattleResult: "Victory",
        yourSurfacePlaneStrength:
          battleStats.yourStats.yourPlanesSurfaceStrength,
      };
    } else if (
      battleStats.yourStats.yourPlanesAirStrength <
      battleStats.enemyStats.enemyPlanesAirStrength
    ) {
      battleTracker.loseAirBattle();
      console.log(battleTracker.getState());
      return {
        msg: `Your enemy won the air battle! Continue battle with /battle/${enemyId}/surfaceBattle`,
        airBattleResult: "Defeat",
        enemySurfacePlaneStrength:
          battleStats.enemyStats.enemyPlanesSurfaceStrength,
      };
    } else {
      battleTracker.drawAirBattle();
      return {
        msg: `The air battle ended in a draw! Continue battle with /battle/${enemyId}/surfaceBattle`,
        airBattleResult: "Draw",
      };
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function surfaceBattle(id: string, enemyId: string) {
  console.log(battleTracker.getState());
  if (
    battleTracker.getState() !== "air_battle_won" &&
    battleTracker.getState() !== "air_battle_lost" &&
    battleTracker.getState() !== "air_draw"
  ) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "please make air battle first"
    );
  } else if (battleTracker.getEnemyId() !== enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `wrong id of an enemy, you've started battle with user id:${battleTracker.getEnemyId()}`
    );
  } else if (id === enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "You cannot fight yourself"
    );
  }
  const client = await pool.connect();
  try {
    const battleStats = await showStats(id, enemyId);

    if (battleTracker.getState() === "air_battle_won") {
      battleStats.enemyStats.enemyPlanesSurfaceStrength = 0;
    } else if (battleTracker.getState() === "air_battle_lost") {
      battleStats.yourStats.yourPlanesSurfaceStrength = 0;
    } else {
      battleStats.yourStats.yourPlanesSurfaceStrength = 0;
      battleStats.enemyStats.enemyPlanesSurfaceStrength = 0;
    }

    let yourStr =
      battleStats.yourStats.yourPlanesSurfaceStrength +
      battleStats.yourStats.yourTanksStrength +
      battleStats.yourStats.yourSquadsStrength;
    let enemyStr =
      battleStats.enemyStats.enemyPlanesSurfaceStrength +
      battleStats.enemyStats.enemyTanksStrength +
      battleStats.enemyStats.enemySquadsStrength;
    let coin = Math.random();

    if (coin >= 0.7) {
      yourStr *= 1.05;
    } else if (coin <= 0.4) {
      enemyStr *= 1.05;
    }
    console.log(yourStr, enemyStr, "yours and enemy str for final battle");
    if (yourStr > enemyStr) {
      battleTracker.notStarted();
      battleTracker.setEnemyId(null);
      return {
        msg: `Congratulations! You won! with your str ${yourStr} versus enemy str ${enemyStr}. Coin was ${coin}`,
      };
    } else if (enemyStr < yourStr) {
      battleTracker.notStarted();
      battleTracker.setEnemyId(null);
      return {
        msg: `Sadly but you lose! with your str ${yourStr} versus enemy str ${enemyStr}. Coin was ${coin}`,
      };
    } else {
      battleTracker.notStarted();
      battleTracker.setEnemyId(null);
      return {
        msg: `Somehow it was a draw! with your str ${yourStr} versus enemy str ${enemyStr}. Coin was ${coin}`,
      };
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function showStats(id: string, enemyId: string) {
  const client = await pool.connect();
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
    const armyId = resultUser.rows[0].id;
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
    const armyEnemyId = resultUserEnemy.rows[0].id;

    const armyTanksQ = await client.query(
      "SELECT SUM(strength) FROM tanks WHERE army_id = $1",
      [armyId]
    );
    let armyTanksStrength = armyTanksQ.rows[0].sum || 0;
    const armyTanksEnemyQ = await client.query(
      "SELECT SUM(strength) FROM tanks WHERE army_id = $1",
      [armyEnemyId]
    );

    let armyTanksEnemyStrength = armyTanksEnemyQ.rows[0].sum || 0;
    console.log(armyTanksStrength, armyTanksEnemyStrength, "TANKS STR");
    const armyPlanesQAir = await client.query(
      "SELECT SUM(air_strength) FROM planes WHERE army_id = $1",
      [armyId]
    );
    let armyPlanesStrengthAir = armyPlanesQAir.rows[0].sum || 0;
    const armyPlanesEnemyQAir = await client.query(
      "SELECT SUM(air_strength) FROM planes WHERE army_id = $1",
      [armyEnemyId]
    );
    let armyPlanesEnemyStrengthAir = armyPlanesEnemyQAir.rows[0].sum || 0;
    const armyPlanesQSurface = await client.query(
      "SELECT SUM(surface_strength) FROM planes WHERE army_id = $1",
      [armyId]
    );
    let armyPlanesStrengthSurface = armyPlanesQSurface.rows[0].sum || 0;
    const armyPlanesEnemyQSurface = await client.query(
      "SELECT SUM(surface_strength) FROM planes WHERE army_id = $1",
      [armyEnemyId]
    );
    let armyPlanesEnemyStrengthSurface =
      armyPlanesEnemyQSurface.rows[0].sum || 0;
    const totalSquadStrengthQuery = `SELECT SUM(weapons.strength)
        FROM squads
        JOIN squads_weapons ON squads.id = squads_weapons.squad_id
        JOIN weapons ON squads_weapons.weapon_id = weapons.id
        WHERE squads.army_id = $1`;

    const armySquadsQ = await client.query(totalSquadStrengthQuery, [armyId]);
    let armySquadsStrength = armySquadsQ.rows[0].sum || 0;
    const armySquadsEnemyQ = await client.query(totalSquadStrengthQuery, [
      armyEnemyId,
    ]);
    let armySquadsEnemyStrength = armySquadsEnemyQ.rows[0].sum || 0;
    switch (resultUser.rows[0].advantage) {
      case "air":
        armyPlanesStrengthAir *= 1.5;
        armyPlanesStrengthSurface *= 1.5;
        break;
      case "heavy_tech":
        armyTanksStrength *= 1.5;
        break;
      case "minefield":
        armyTanksEnemyStrength *= 0.7;
        armySquadsEnemyStrength *= 0.9;
        break;
      case "patriotic":
        armySquadsStrength *= 1.5;
        break;
    }

    switch (resultUserEnemy.rows[0].advantage) {
      case "air":
        armyPlanesEnemyStrengthAir *= 1.5;
        armyPlanesEnemyStrengthSurface *= 1.5;
        break;
      case "heavy_tech":
        armyTanksEnemyStrength *= 1.5;
        break;
      case "minefield":
        armyTanksStrength *= 0.7;
        armySquadsStrength *= 0.9;
        break;
      case "patriotic":
        armySquadsEnemyStrength *= 1.5;
        break;
    }

    const battleStats = {
      yourStats: {
        yourTanksStrength: parseFloat(armyTanksStrength),
        yourPlanesAirStrength: parseFloat(armyPlanesStrengthAir),
        yourPlanesSurfaceStrength: parseFloat(armyPlanesStrengthSurface),
        yourSquadsStrength: parseFloat(armySquadsStrength),
        yourAdvantage: resultUser.rows[0].advantage,
      },
      enemyStats: {
        enemyTanksStrength: parseFloat(armyTanksEnemyStrength),
        enemyPlanesAirStrength: parseFloat(armyPlanesEnemyStrengthAir),
        enemyPlanesSurfaceStrength: parseFloat(armyPlanesEnemyStrengthSurface),
        enemySquadsStrength: parseFloat(armySquadsEnemyStrength),
        enemyAdvantage: resultUserEnemy.rows[0].advantage,
      },
    };
    return battleStats;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

const battleTracker = new BattleState();
