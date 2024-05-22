"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = void 0;
const Player_1 = require("./Player");
class Food extends Player_1.Player {
    get givenSize() {
        return 1;
    }
    constructor(x, y) {
        super(x, y, "food");
        this.size = Food.defaultFoodSize;
    }
}
Food.defaultFoodSize = 10;
exports.Food = Food;
//# sourceMappingURL=Food.js.map