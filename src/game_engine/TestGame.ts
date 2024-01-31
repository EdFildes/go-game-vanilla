import { Game } from "./Game";
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
      this.boardInstance.makeMove(position);

      // change to next color
      if (!this.fixColor)
        this.currentColor = this.currentColor === "O" ? "X" : "O";
    }
  }
}
