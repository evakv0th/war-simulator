import pool from "../db/db";
import HttpException from "../exceptions/http-exceptions";
import HttpStatusCode from "../exceptions/statusCode";
import { BattleState } from "./battle-state";

export async function showStats(id: string, enemyId: string) {
    const client = await pool.connect();
    try {
      const resultUser = await client.query(
        'SELECT * FROM armies WHERE user_id=$1',
        [id],
      );
      if (resultUser.rows.length <= 0) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'you do not have army yet',
        );
      }
      const armyId = resultUser.rows[0].id;
      const resultUserEnemy = await client.query(
        'SELECT * FROM armies WHERE user_id=$1',
        [enemyId],
      );
      if (resultUserEnemy.rows.length <= 0) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'your enemy does not have army yet',
        );
      }
      const armyEnemyId = resultUserEnemy.rows[0].id;
  
      const armyTanksQ = await client.query(
        'SELECT SUM(strength) FROM tanks WHERE army_id = $1',
        [armyId],
      );
      let armyTanksStrength = armyTanksQ.rows[0].sum || 0;
      const armyTanksEnemyQ = await client.query(
        'SELECT SUM(strength) FROM tanks WHERE army_id = $1',
        [armyEnemyId],
      );
  
      let armyTanksEnemyStrength = armyTanksEnemyQ.rows[0].sum || 0;
      const armyPlanesQAir = await client.query(
        'SELECT SUM(air_strength) FROM planes WHERE army_id = $1',
        [armyId],
      );
      let armyPlanesStrengthAir = armyPlanesQAir.rows[0].sum || 0;
      const armyPlanesEnemyQAir = await client.query(
        'SELECT SUM(air_strength) FROM planes WHERE army_id = $1',
        [armyEnemyId],
      );
      let armyPlanesEnemyStrengthAir = armyPlanesEnemyQAir.rows[0].sum || 0;
      const armyPlanesQSurface = await client.query(
        'SELECT SUM(surface_strength) FROM planes WHERE army_id = $1',
        [armyId],
      );
      let armyPlanesStrengthSurface = armyPlanesQSurface.rows[0].sum || 0;
      const armyPlanesEnemyQSurface = await client.query(
        'SELECT SUM(surface_strength) FROM planes WHERE army_id = $1',
        [armyEnemyId],
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
        case 'air':
          armyPlanesStrengthAir *= 1.5;
          armyPlanesStrengthSurface *= 1.5;
          break;
        case 'heavy_tech':
          armyTanksStrength *= 1.5;
          break;
        case 'minefield':
          armyTanksEnemyStrength *= 0.7;
          armySquadsEnemyStrength *= 0.9;
          break;
        case 'patriotic':
          armySquadsStrength *= 1.5;
          break;
      }
  
      switch (resultUserEnemy.rows[0].advantage) {
        case 'air':
          armyPlanesEnemyStrengthAir *= 1.5;
          armyPlanesEnemyStrengthSurface *= 1.5;
          break;
        case 'heavy_tech':
          armyTanksEnemyStrength *= 1.5;
          break;
        case 'minefield':
          armyTanksStrength *= 0.7;
          armySquadsStrength *= 0.9;
          break;
        case 'patriotic':
          armySquadsEnemyStrength *= 1.5;
          break;
      }
  
      const battleStats = {
        yourStats: {
          yourTanksStrength: parseInt(armyTanksStrength),
          yourPlanesAirStrength: parseInt(armyPlanesStrengthAir),
          yourPlanesSurfaceStrength: parseInt(armyPlanesStrengthSurface),
          yourSquadsStrength: parseInt(armySquadsStrength),
          yourAdvantage: resultUser.rows[0].advantage,
        },
        enemyStats: {
          enemyTanksStrength: parseInt(armyTanksEnemyStrength),
          enemyPlanesAirStrength: parseInt(armyPlanesEnemyStrengthAir),
          enemyPlanesSurfaceStrength: parseInt(armyPlanesEnemyStrengthSurface),
          enemySquadsStrength: parseInt(armySquadsEnemyStrength),
          enemyAdvantage: resultUserEnemy.rows[0].advantage,
        },
      };
      return battleStats;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }
  
  export const battleTracker = new BattleState();
  