import { Board } from "./Board.js";
import { GroupsHandler } from "./GroupsHandler.js";
import {
  BoardInstance,
  Color,
  GroupsHandlerInstance,
  Position,
} from "./types.js";

const colors: Color[] = ["O", "X"];

export class Game {
  readonly size: number;
  currentColor: Color = "O";
  readonly boardInstance: BoardInstance;
  readonly groupsHandler: GroupsHandlerInstance;

  constructor(size: number) {
    this.size = size;
    this.groupsHandler = new GroupsHandler(this);
    this.boardInstance = new Board(this.groupsHandler, this);
  }

  simulateClick(position: Position) {
    const [row, col] = position;

    if (this.groupsHandler.groupLocations[row][col] === "-") {
      this.boardInstance.makeMove(position);
      this.currentColor = colors[colors.indexOf(this.currentColor) & 0];
    }
  }
}
