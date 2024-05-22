import { Player } from "./Player";
import { Map as GameMap } from "./Map";

describe("collision", () => {
    it("should get the collision", () => {
        const map = new GameMap(1000, 1000);
        const player1 = new Player(0, 0, "player1");
        const player2 = new Player(0, 0, "player2");
        map.addPlayer(player1);
        map.addPlayer(player2);
        let collision = map.getCollision(player1);
        expect(collision).toBe(player2);
        player2.x = 20;
        collision = map.getCollision(player1);
        expect(collision).toBe(player2);
    })
    it("should not get the collision", () => {
        const map = new GameMap(1000, 1000);
        const player1 = new Player(0, 0, "player1");
        const player2 = new Player(75, 75, "player2");
        map.addPlayer(player1);
        map.addPlayer(player2);
        const collision = map.getCollision(player1);
        expect(collision).toBe(null);
    })
});


describe("movement", () => {
    it("should move", () => {
        const map = new GameMap(1000, 1000)
        const player1 = new Player(0, 0, "player1");
        const player2 = new Player(75, 0, "player2")
        map.addPlayer(player1);
        map.addPlayer(player2);
        player1.deltaX = 1;
        player2.deltaX = -1;
        map.movePlayers();
        expect(player1.x).toBeCloseTo(33.3333);
        expect(player2.x).toBeCloseTo(41.6666)
    })

    it("should collide", () => {
        const map = new GameMap(1000, 1000)
        const player1 = new Player(0, 0, "player1");
        const player2 = new Player(75, 0, "player2")
        map.addPlayer(player1);
        map.addPlayer(player2);
        player1.deltaX = 1;
        player2.deltaX = -1;
        player2.size = 10;
        for(let i = 0; i < 300; i++) {
            map.foods = []
            map.movePlayers();
            map.collision();
        }
        expect(player2.isAlive).toBe(false);
        expect(player1.size).toBe(40);
    })
})