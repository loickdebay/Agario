import { scoreboard } from "../scoreboard"; 

export class Player {
    public static readonly defaultPlayerSize = 30

    name: string;
    x: number;
    y: number;
    size: number;
    deltaX: number;
    deltaY: number;
    color: string;
    socketID?: string;
    creationDate: number;
    dieDate?: number;

    get givenSize() {
        return this.size;
    }
    
    get isAlive() {
        return this.size !== 0;
    }

    get hitboxSize() {
        return (4/5) * this.size;
    }

    get score() {
        if(!this.dieDate) return 0;
        const timeValue = (this.dieDate - this.creationDate) / 1000 / 60;
        const score = Math.floor(timeValue * this.size)
        return score;
    }

    constructor(x: number, y: number, name: string, socketID?: string) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.size = Player.defaultPlayerSize;
        this.deltaX = 0;
        this.deltaY = 0;
        this.color = this.randomColor()
        this.socketID = socketID;
        this.creationDate = Date.now();
    }

    public move() {
        let moveX = this.deltaX * 2 * (100/this.size) * 5;
        let moveY = this.deltaY * 2 * (100/this.size) * 5;
        if(moveX < 1 && moveX > -1) moveX = this.deltaX * 2
        if(moveY < 1 && moveY > -1) moveY = this.deltaY * 2
        this.x += moveX;
        this.y += moveY
    }

    public collision(other: Player) {
        if(other.size < this.hitboxSize && other.isAlive && other.size!=Player.defaultPlayerSize) {
            this.eat(other)
        }
    }

    private eat(other: Player) {
        this.size += other.givenSize;
        if(other.constructor.name !== "Food") {
            other.addToScoreBoard()
        }
        other.size = 0;
    }

    public isInCollision(other: Player) {
        if(other === this) return false
        let distance = 0
        distance += this.square(other.x - this.x);
        distance += this.square(other.y - this.y);
        distance = Math.sqrt(distance);
        distance -= other.hitboxSize
        return distance < this.hitboxSize;
    }

    private square(x: number) {
        return x**2
    }

    private randomColor() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }

    public static createPlayerArrayFromObjectArray(players: Player[]) {
        const res: Player[] = [];
        players.forEach(player => {
            const toAdd = new Player(player.x, player.y, player.name, player.socketID);
            toAdd.creationDate = player.creationDate;
            toAdd.dieDate = player.dieDate;
            res.push(toAdd)
        })
        return res;
    }

    public addToScoreBoard() {
        const savedPlayer = new Player(0, 0, this.name);
        savedPlayer.creationDate = this.creationDate
        savedPlayer.size = this.size
        savedPlayer.dieDate = Date.now();
        scoreboard.addPlayer(savedPlayer);
    }
}