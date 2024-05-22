import { Food } from "./Food";
import { Player } from "./Player";

export class Map {
    private static readonly initialFoodNumber = 1000

    public players: Player[];
    public foods: Food[];

    public readonly length: number;
    public readonly width: number

    constructor(length: number, width: number) {
        this.length = length
        this.width = width
        this.players = [];
        this.foods = [];
        this.initFood()
        this.updateFood()
        this.clean();
    }

    private clean() {
        setInterval(() => {
            this.foods = this.foods.filter(food => food.isAlive);
            this.players = this.players.filter(player => player.isAlive);
        }, 1000/60)
    }

    public createFood() {
        const x = Math.round(Math.random() * this.length);
        const y = Math.round(Math.random() * this.width);
        const food = new Food(x, y);
        return food;
    }

    private initFood() {
        for(let i = 0; i < Map.initialFoodNumber; i++) {
            this.foods.push(this.createFood());
        }
    }

    public addPlayer(player: Player) {
        this.players.push(player)
    }

    public addFood() {
        this.foods.push(this.createFood());
    }

    public playerIsInAnOtherPlayer(playerParam: Player) {
        let returnValue = false
        this.players.forEach(player => {
            if(playerParam.isInCollision(player)) returnValue = true
        })
        return returnValue;
    }

    public getCollision(playerParam: Player): Player | null {
        let returnValue = null
        this.players.forEach(player => {
            if(playerParam.isInCollision(player)) returnValue = player
        })
        return returnValue
    }

    public foodCollision(player: Player) {
        this.foods.forEach(food => {
            if(player.isInCollision(food)) player.collision(food)
        })
    }

    public movePlayers() {
        this.players.forEach(player => {
            const oldX = player.x
            const oldY = player.y;
            player.move();
            
            if(player.x + player.hitboxSize >= this.length - 1) player.x = this.length - 1 - player.hitboxSize;
            if(player.x - player.hitboxSize <= 1) player.x = 1 + player.hitboxSize
            if(player.y - player.hitboxSize <= 1) player.y = 1 + player.hitboxSize;
            if(player.y + player.hitboxSize >= this.width - 1) player.y = this.width - 1 - player.hitboxSize;
        })
    }

    public collision() {
        this.players.forEach(player => {
            const collision = this.getCollision(player);
            if(collision) player.collision(collision);
            this.foodCollision(player)
        })
    }


	public removePlayer(player: Player) {
        this.players.splice(this.players.indexOf(player), 1);
    }

    public async updateFood() {
        this.foods.push(this.createFood())
        setTimeout(async () => {
            this.updateFood()
        }, 1000 * 0.5)
    }

}