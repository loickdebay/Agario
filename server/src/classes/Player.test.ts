import { Player } from "./Player";
import { Map as GameMap } from "./Map";
import { Food } from "./Food";

describe('Two players with different size', () => {
    
    it('should be eaten by the bigger player', function() {
        const bigger = new Player(0, 0, "big");
        bigger.size = 300;
        const smaller = new Player(0, 0, "small");
        bigger.collision(smaller)
        expect(smaller.isAlive).toBe(false)
        expect(bigger.size).toBe(300 + Player.defaultPlayerSize)
    });
    it("should not be eaten by the smallest player", function() {
        const bigger = new Player(0, 0, "big")
        bigger.size = 300;
        const smaller = new Player(0, 0, "small");
        smaller.collision(bigger)
        expect(bigger.isAlive).toBe(true)
        expect(smaller.size).toBe(Player.defaultPlayerSize)
    })
    it("should be in the other collision area", function() {
        const bigger = new Player(0, 0, "big")
        bigger.size = 300;
        const smaller = new Player(0, 0, "small");
        const inCollision = smaller.isInCollision(bigger)
        expect(inCollision).toBe(true)
    })
});

describe('Two players with the same size', () => {
    it('should not be eaten', function() {
        const player1 = new Player(0, 0, "player1");
        const player2 = new Player(0, 0, "player2");
        player1.collision(player2)
        expect(player1.isAlive).toBe(true)
        expect(player2.isAlive).toBe(true)
    });
    it("should be in the other collision area", function() {
        const player1 = new Player(0, 0, "player1");
        const player2 = new Player(0, 0, "player2");
        const inCollision = player1.isInCollision(player2)
        expect(inCollision).toBe(true)
    })
    it("should not be in the other collision area", function() {
        const player1 = new Player(0, 0, "player1");
        const player2 = new Player(75, 75, "player2");
        const inCollision = player1.isInCollision(player2)
        expect(inCollision).toBe(false)
    })
});

describe('Player with food', () => {
    const map = new GameMap(1000, 1000);
    it('should eat the food', function() {
        const player = new Player(0, 0, "player");
        const food = map.createFood();
        player.collision(food)
        expect(player.size).toBe(Player.defaultPlayerSize + new Food(0, 0).givenSize)
    });
    it("should be in the other collision area", function() {
        const player = new Player(0, 0, "player");
        const food = map.createFood();
        player.x = food.x;
        player.y = food.y;
        const inCollision = player.isInCollision(food)
        expect(inCollision).toBe(true)
    })
});

describe("A player", () => {
    const player = new Player(5000, 5000, "test");
    it("should have a score", () => {
        player.creationDate = Date.now();
        player.dieDate = player.creationDate + (1 * 60 * 1000) // + 1 minute
        expect(player.score).toBe(30)
    })
})