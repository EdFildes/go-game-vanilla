import { Board } from "./Board.js";
import { GroupsHandler } from "./GroupsHandler.js";
import { BoardInstance, Color, GroupsHandlerInstance, Position } from "./types.js"

export class Game {
  size: number;
  currentColor: Color = "O";
  boardInstance: BoardInstance;
  groupsHandler: GroupsHandlerInstance;

  constructor(size: number) {
    this.size = size;
    this.groupsHandler = new GroupsHandler(this)
    this.boardInstance = new Board(this.groupsHandler, this);
  }

  simulateClick(position: Position) {
    const [row, col] = position;

    if(this.groupsHandler.groupLocations[row][col] === "-"){
      this.boardInstance.makeMove(position)
      this.currentColor = this.currentColor === "O" ? "X" : "O"
    }
  }
}