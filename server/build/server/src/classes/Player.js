"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const scoreboard_1 = require("../scoreboard");
class Player {
    get givenSize() {
        return this.size;
    }
    get isAlive() {
        return this.size !== 0;
    }
    get hitboxSize() {
        return (4 / 5) * this.size;
    }
    get score() {
        if (!this.dieDate)
            return 0;
        const timeValue = (this.dieDate - this.creationDate) / 1000 / 60;
        const score = Math.floor(timeValue * this.size);
        return score;
    }
    constructor(x, y, name, socketID) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.size = Player.defaultPlayerSize;
        this.deltaX = 0;
        this.deltaY = 0;
        this.color = this.randomColor();
        this.socketID = socketID;
        this.creationDate = Date.now();
    }
    move() {
        let moveX = this.deltaX * 2 * (100 / this.size) * 5;
        let moveY = this.deltaY * 2 * (100 / this.size) * 5;
        if (moveX < 1 && moveX > -1)
            moveX = this.deltaX * 2;
        if (moveY < 1 && moveY > -1)
            moveY = this.deltaY * 2;
        this.x += moveX;
        this.y += moveY;
    }
    collision(other) {
        if (other.size < this.hitboxSize && other.isAlive && other.size != Player.defaultPlayerSize) {
            this.eat(other);
        }
    }
    eat(other) {
        this.size += other.givenSize;
        if (other.constructor.name !== "Food") {
            other.addToScoreBoard();
        }
        other.size = 0;
    }
    isInCollision(other) {
        if (other === this)
            return false;
        let distance = 0;
        distance += this.square(other.x - this.x);
        distance += this.square(other.y - this.y);
        distance = Math.sqrt(distance);
        distance -= other.hitboxSize;
        return distance < this.hitboxSize;
    }
    square(x) {
        return Math.pow(x, 2);
    }
    randomColor() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
    static createPlayerArrayFromObjectArray(players) {
        const res = [];
        players.forEach(player => {
            const toAdd = new Player(player.x, player.y, player.name, player.socketID);
            toAdd.creationDate = player.creationDate;
            toAdd.dieDate = player.dieDate;
            res.push(toAdd);
        });
        return res;
    }
    addToScoreBoard() {
        const savedPlayer = new Player(0, 0, this.name);
        savedPlayer.creationDate = this.creationDate;
        savedPlayer.size = this.size;
        savedPlayer.dieDate = Date.now();
        scoreboard_1.scoreboard.addPlayer(savedPlayer);
    }
}
Player.defaultPlayerSize = 30;
exports.Player = Player;
//# sourceMappingURL=Player.js.map