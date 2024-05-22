"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const Map_1 = require("./Map");
describe("collision", () => {
    it("should get the collision", () => {
        const map = new Map_1.Map(1000, 1000);
        const player1 = new Player_1.Player(0, 0, "player1");
        const player2 = new Player_1.Player(0, 0, "player2");
        map.addPlayer(player1);
        map.addPlayer(player2);
        let collision = map.getCollision(player1);
        expect(collision).toBe(player2);
        player2.x = 20;
        collision = map.getCollision(player1);
        expect(collision).toBe(player2);
    });
    it("should not get the collision", () => {
        const map = new Map_1.Map(1000, 1000);
        const player1 = new Player_1.Player(0, 0, "player1");
        const player2 = new Player_1.Player(75, 75, "player2");
        map.addPlayer(player1);
        map.addPlayer(player2);
        const collision = map.getCollision(player1);
        expect(collision).toBe(null);
    });
});
describe("movement", () => {
    it("should move", () => {
        const map = new Map_1.Map(1000, 1000);
        const player1 = new Player_1.Player(0, 0, "player1");
        const player2 = new Player_1.Player(75, 0, "player2");
        map.addPlayer(player1);
        map.addPlayer(player2);
        player1.deltaX = 1;
        player2.deltaX = -1;
        map.movePlayers();
        expect(player1.x).toBeCloseTo(25);
        expect(player2.x).toBeCloseTo(66.66666);
    });
    it("should collide", () => {
        const map = new Map_1.Map(1000, 1000);
        const player1 = new Player_1.Player(0, 0, "player1");
        const player2 = new Player_1.Player(75, 0, "player2");
        map.addPlayer(player1);
        map.addPlayer(player2);
        player1.deltaX = 1;
        player2.deltaX = -1;
        player2.size = 10;
        for (let i = 0; i < 300; i++) {
            map.foods = [];
            map.movePlayers();
            map.collision();
        }
        expect(player2.isAlive).toBe(false);
        expect(player1.size).toBe(40);
    });
});
//# sourceMappingURL=Map.test.js.map