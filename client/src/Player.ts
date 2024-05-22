class Player {
	color: string;
	creationDate: number;
	dieDate?: number;
	size: number;
	x: number;
	y: number;
	name: string;
	deltaX: number;
	deltaY: number;
	get isAlive() {
		return this.size !== 0;
	}
	constructor(x = 5000, y = 5000, name: string = "") {
		this.x = x;
		this.y = y;
		this.name = name;
		this.size = 0;
		this.deltaX = 0;
		this.deltaY = 0;
		this.creationDate = Date.now();
		this.color = "";
	}
	
    get score() {
        if(!this.dieDate) return 0;
        const timeValue = (this.dieDate - this.creationDate) / 1000 / 60;
        const score = Math.floor(timeValue * this.size)
        return score;
    }
}

export { Player };
