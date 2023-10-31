export class BattleState {
  private enemyId: string | null;
  private state: string;

  constructor() {
    this.enemyId = null;
    this.state = "not_started";
  }

  startBattle() {
    this.state = "in_progress";
  }

  winAirBattle() {
    this.state = "air_battle_won";
  }

  loseAirBattle() {
    this.state = "air_battle_lost";
  }
  drawAirBattle() {
    this.state = "air_draw";
  }

  notStarted() {
    this.state = "not_started";
  }

  setEnemyId(enemyId: string | null) {
    this.enemyId = enemyId;
  }

  getEnemyId() {
    return this.enemyId;
  }

  getState() {
    return this.state;
  }
}
