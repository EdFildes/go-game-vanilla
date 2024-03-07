import { checkNeighbours } from "./Board/helpers/checkNeighbours";
import { Game, colors } from "./Game";
import { Color, Position, Row } from "./types.js";

export class TestGame extends Game {
  fixColor: boolean = false; // for testing. Should really exist in an extension

  setFixColor(state: boolean) {
    this.fixColor = state;
  }

  setCurrentColor(color: Color) {
    this.currentColor = color;
  }

  printGroups(logToConsole: boolean = false) {
    logToConsole &&
      this.groupsHandler.groupLocations.forEach((row: Row) =>
        console.log(row.join(" ")),
      );
    return this.groupsHandler.groupLocations
      .map((row: Row) => row.join(" "))
      .join("\n");
  }

  printBoard() {
    const boardIllustration: string[] = [];
    this.groupsHandler.groupLocations.forEach((row: Row) => {
      const mappedRow = row.map((id) => {
        const group = this.groupsHandler.groupLookup(id)
        return group.color
      });
      boardIllustration.push(mappedRow.join(" "));
    });
    return boardIllustration.join("\n");
  }

  simulateClick(position: Position) {
    const [row, col] = position;

    if (this.groupsHandler.groupLocations[row][col] === "-") {
      
      console.log("\n ** new turn...\n", "Current color ", this.currentColor)

      let neighbours = checkNeighbours(this.groupsHandler, position, this);

      const canMove = neighbours.some(neighbour => 
        neighbour.type === "EMPTY" || 
        (neighbour.type === "FRIENDLY" && neighbour.groupInstance.liberties.length > 1) || 
        (neighbour.type === "UNFRIENDLY" && neighbour.groupInstance.liberties.length === 1)
      )

      if(canMove){
        this.makeMove(position, neighbours)
        this.currentColor = colors[colors.indexOf(this.currentColor) ^ 1];

        // change to next color
        if (!this.fixColor)
        this.currentColor = this.currentColor === "O" ? "X" : "O";
      }
    }
  }
}
