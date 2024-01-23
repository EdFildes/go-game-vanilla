import { TestGame } from "./TestGame.js";


const game = new TestGame(8)

game.setCurrentColor("O")
game.setFixColor(true);
console.log("new click")
game.simulateClick([3, 4]);
console.log("new click")
game.simulateClick([2, 5]);
console.log("new click")
game.simulateClick([3, 6]);
game.setCurrentColor("X")
console.log("new click")
game.simulateClick([3, 5]);
game.setCurrentColor("O")
console.log("new click")
game.simulateClick([4, 5]);

//game.printGroups(true)
console.log(game.printBoard())