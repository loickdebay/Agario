"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const Food_1 = require("./Food");
class Map {
    constructor(length, width) {
        this.length = length;
        this.width = width;
        this.players = [];
        this.foods = [];
        this.initFood();
        this.updateFood();
        this.clean();
    }
    clean() {
        setInterval(() => {
            this.foods = this.foods.filter(food => food.isAlive);
            this.players = this.players.filter(player => player.isAlive);
        }, 1000 / 60);
    }
    createFood() {
        const x = Math.round(Math.random() * this.length);
        const y = Math.round(Math.random() * this.width);
        const food = new Food_1.Food(x, y);
        return food;
    }
    initFood() {
        for (let i = 0; i < Map.initialFoodNumber; i++) {
            this.foods.push(this.createFood());
        }
    }
    addPlayer(player) {
        this.players.push(player);
    }
    addFood() {
        this.foods.push(this.createFood());
    }
    playerIsInAnOtherPlayer(playerParam) {
        let returnValue = false;
        this.players.forEach(player => {
            if (playerParam.isInCollision(player))
                returnValue = true;
        });
        return returnValue;
    }
    getCollision(playerParam) {
        let returnValue = null;
        this.players.forEach(player => {
            if (playerParam.isInCollision(player))
                returnValue = player;
        });
        return returnValue;
    }
    foodCollision(player) {
        this.foods.forEach(food => {
            if (player.isInCollision(food))
                player.collision(food);
        });
    }
    movePlayers() {
        this.players.forEach(player => {
            const oldX = player.x;
            const oldY = player.y;
            player.move();
            if (player.x + player.hitboxSize >= this.length - 1)
                player.x = this.length - 1 - player.hitboxSize;
            if (player.x - player.hitboxSize <= 1)
                player.x = 1 + player.hitboxSize;
            if (player.y - player.hitboxSize <= 1)
                player.y = 1 + player.hitboxSize;
            if (player.y + player.hitboxSize >= this.width - 1)
                player.y = this.width - 1 - player.hitboxSize;
        });
    }
    collision() {
        this.players.forEach(player => {
            const collision = this.getCollision(player);
            if (collision)
                player.collision(collision);
            this.foodCollision(player);
        });
    }
    removePlayer(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }
    updateFood() {
        return __awaiter(this, void 0, void 0, function* () {
            this.foods.push(this.createFood());
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                this.updateFood();
            }), 1000 * 0.5);
        });
    }
}
Map.initialFoodNumber = 1000;
exports.Map = Map;
//# sourceMappingURL=Map.js.map