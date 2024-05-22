import { Player } from "./Player";

class Map {
	length: number;
	width: number;
	players: Player[];
	foods: Player[];
	constructor(length: number = 10000, width: number = 10000) {
		this.length = length;
		this.width = width;
		this.players = [];
		this.foods = [];
	}
}
export { Map };
