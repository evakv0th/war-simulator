export class BattleState {
    private state: string;
  
    constructor() {
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
    drawAirBattle(){
        this.state = "air_draw"
     }

    notStarted(){
        this.state = "not_started"
    }
 
    getState() {
      return this.state;
    }
  }