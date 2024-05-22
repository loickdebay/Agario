import { Player } from "./Player";

export class Food extends Player {
    public static readonly defaultFoodSize = 10
    
    
    get givenSize() {
        return 1;
    }

    constructor(x: number, y: number) {
        super(x, y, "food");
        this.size = Food.defaultFoodSize
    }
   

    
}