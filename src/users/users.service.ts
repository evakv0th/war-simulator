import HttpException from '../application/exceptions/http-exceptions';
import HttpStatusCode from '../application/exceptions/statusCode';
import { BattleState } from '../application/utils/battle-state';
import { UserCreateSchema, User } from '../auth/types/auth.interfaces';
import pool from '../application/db/db';
import { battleTracker, showStats } from '../application/utils/battleStats.helper';

export async function getUsers(queryParameters?: any): Promise<User[]> {
  const client = await pool.connect();

  try {
    const { name } = queryParameters;

    let query = 'SELECT * FROM users';
    const values = [];
    if (name) {
      query += ' WHERE name ILIKE $1';
      values.push(`%${name}%`);
    }

    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function getUserById(id: string): Promise<User> {
  const client = await pool.connect();

  try {
    let query = 'SELECT * FROM users WHERE id = $1';
    const values = [];
    values.push(id);
    const result = await client.query(query, values);
    if (result.rows.length <= 0) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        `user with id:${id} not found`,
      );
    }
    let queryArmy = 'SELECT * FROM armies WHERE user_id = $1';
    const army = await client.query(queryArmy, [id]);
    return { ...result.rows[0], army: army.rows[0] };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function updateUser(
  id: string,
  updateData: Partial<UserCreateSchema>,
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

  const changes = arrayWithChanges.join(', ');

  const queryUpd = `UPDATE users SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    if (arrayWithChanges.length === 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        'No valid fields provided for update',
      );
    }

    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0)
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'user not found');

    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteUser(id: string): Promise<User> {
  const client = await pool.connect();

  try {
    let query = 'DELETE FROM users WHERE id=$1;';
    const values = [];
    values.push(id);
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function battle(id: string, enemyId: string) {
  if (battleTracker.getState() !== 'not_started') {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      'please finish your last battle before starting new one',
    );
  } else if (id === enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      'You cannot fight yourself',
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
        'You cant start battle, you should have at least 1 squad(with weapons!!), 1 tank and 1 plane',
      );
    }
    if (
      battleStats.enemyStats.enemyPlanesAirStrength === 0 ||
      battleStats.enemyStats.enemyTanksStrength === 0 ||
      battleStats.enemyStats.enemySquadsStrength === 0
    ) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        'You cant start battle, your enemy should have at least 1 tank, 1 plane and 1 squad (with weapons!!)',
      );
    }
    battleTracker.startBattle();
    battleTracker.setEnemyId(enemyId);
    return {
      msg: 'the battle has started! These are stats of you and your enemy (with advantages included in numbers).',
      msg2: `You can use endpoint /battle/${enemyId}/airBattle to continue the battle and start Air stage.`,
      battleStats: await battleStats,
    };
  } catch (err) {

    throw err;
  } finally {
    client.release();
  }
}

export async function airBattle(id: string, enemyId: string) {
  if (battleTracker.getState() !== 'in_progress') {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      'please start battle first',
    );
  } else if (battleTracker.getEnemyId() !== enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `wrong id of an enemy, you've started battle with user id:${battleTracker.getEnemyId()}`,
    );
  } else if (id === enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      'You cannot fight yourself',
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
        airBattleResult: 'Victory',
        yourSurfacePlaneStrength:
          battleStats.yourStats.yourPlanesSurfaceStrength,
      };
    } else if (
      battleStats.yourStats.yourPlanesAirStrength <
      battleStats.enemyStats.enemyPlanesAirStrength
    ) {
      battleTracker.loseAirBattle();
      return {
        msg: `Your enemy won the air battle! Continue battle with /battle/${enemyId}/surfaceBattle`,
        airBattleResult: 'Defeat',
        enemySurfacePlaneStrength:
          battleStats.enemyStats.enemyPlanesSurfaceStrength,
      };
    } else {
      battleTracker.drawAirBattle();
      return {
        msg: `The air battle ended in a draw! Continue battle with /battle/${enemyId}/surfaceBattle`,
        airBattleResult: 'Draw',
      };
    }
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function surfaceBattle(id: string, enemyId: string) {
  if (
    battleTracker.getState() !== 'air_battle_won' &&
    battleTracker.getState() !== 'air_battle_lost' &&
    battleTracker.getState() !== 'air_draw'
  ) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      'please make air battle first',
    );
  } else if (battleTracker.getEnemyId() !== enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `wrong id of an enemy, you've started battle with user id:${battleTracker.getEnemyId()}`,
    );
  } else if (id === enemyId) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      'You cannot fight yourself',
    );
  }
  const client = await pool.connect();
  try {
    const battleStats = await showStats(id, enemyId);

    if (battleTracker.getState() === 'air_battle_won') {
      battleStats.enemyStats.enemyPlanesSurfaceStrength = 0;
    } else if (battleTracker.getState() === 'air_battle_lost') {
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
    let result = yourStr - enemyStr
    if (result > 0) {
      battleTracker.notStarted();
      battleTracker.setEnemyId(null);
      return {
        msg: `Congratulations! You won! with your str ${yourStr} versus enemy str ${enemyStr}. Coin was ${coin}`,
      };
    } else if (result < 0) {
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
    throw err;
  } finally {
    client.release();
  }
}
