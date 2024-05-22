import { Player } from "./classes/Player";

class Scoreboard {
    public scoreboard: Player[] = [];


    public addPlayer(player: Player) {
        console.log(player)
        this.scoreboard.push(player);
    }

    public sort() {
        this.scoreboard.sort((a, b) => {
            return b.score - a.score;
        })
    }

    public removeDeadPlayers() {
        for(let i = this.scoreboard.length - 1; i >= 0; i--) {
            if(!this.scoreboard[i].isAlive) this.scoreboard.splice(i, 1);
        }
    }

}

let scoreboard: Scoreboard = new Scoreboard();



export {
    scoreboard
}