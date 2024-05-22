"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreboard = void 0;
class Scoreboard {
    constructor() {
        this.scoreboard = [];
    }
    addPlayer(player) {
        console.log(player);
        this.scoreboard.push(player);
    }
    sort() {
        this.scoreboard.sort((a, b) => {
            return b.score - a.score;
        });
    }
    removeDeadPlayers() {
        for (let i = this.scoreboard.length - 1; i >= 0; i--) {
            if (!this.scoreboard[i].isAlive)
                this.scoreboard.splice(i, 1);
        }
    }
}
let scoreboard = new Scoreboard();
exports.scoreboard = scoreboard;
//# sourceMappingURL=scoreboard.js.map