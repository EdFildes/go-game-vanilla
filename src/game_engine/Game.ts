import { Board } from "./Board/Board.js";
import { GroupsHandler } from "./GroupsHandler/GroupsHandler.js";
import { getGroupColor } from "./helpers.js";
import {
  BoardInstance,
  Color,
  GroupsHandlerInstance,
  Position,
  Row,
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
      console.log("\n ** new turn...")
      console.log("current color ", this.currentColor)
      const hadGo = this.boardInstance.makeMove(position);
      if(hadGo) {
        //this.currentColor = colors[colors.indexOf(this.currentColor) & 0];
        this.currentColor = this.currentColor === "O" ? "X" : "O";

        // debug info
        Object.values(this.groupsHandler.groupLookup).forEach(group => {
          console.log("group: ", group.id, " liberties: ", group.liberties)
        })
        this.groupsHandler.groupLocations.forEach((row: Row) => console.log(row.join(" ")));
      }
    }
  }

  getPositions(){
    const boardIllustration: string[][] = [];
    this.groupsHandler.groupLocations.forEach((row: Row) => {
      const mappedRow: string[] = row.map((id) => getGroupColor(this.groupsHandler, id));
      boardIllustration.push(mappedRow);
    });
    return boardIllustration;
  }
}
