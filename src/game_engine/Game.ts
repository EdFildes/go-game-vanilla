import { checkNeighbours } from "./Board/helpers/checkNeighbours.js";
import { GroupsHandler } from "./GroupsHandler/GroupsHandler.js";
import { getLiberties } from "./GroupsHandler/helpers/getLiberties.js";
import { getGroupColor } from "./helpers.js";
import {
  Color,
  GroupInstance,
  GroupsHandlerInstance,
  NeighbourProps,
  Position,
  Row,
} from "./types.js";

export const colors: Color[] = ["O", "X"];

const debug = (groupsHandler: GroupsHandlerInstance) => {
  // debug info
  Object.values(groupsHandler.groupLookup).forEach((group: GroupInstance) => {
    console.log("group: ", group.id, " liberties: ", group.liberties, " occupations: ", group.occupations)
  })
  groupsHandler.groupLocations.forEach((row: Row) => console.log(row.join(" ")));
}


export class Game {
  readonly size: number;
  currentColor: Color = colors[0];
  readonly groupsHandler: GroupsHandlerInstance;

  constructor(size: number) {
    this.size = size;
    this.groupsHandler = new GroupsHandler(this);
  }

  makeMove(position: Position, neighbours: NeighbourProps[]){
    const { liberties, occupations } = getLiberties(neighbours);
    let groupId = this.groupsHandler.createNewGroup([position], liberties, occupations);

    for(let neighbour of neighbours){
      if(neighbour.type === "FRIENDLY"){
        neighbour.groupInstance.removeLiberties([position]);
        this.groupsHandler.mergeGroups(groupId, neighbour.groupInstance.id);
      }
      if(neighbour.type === "UNFRIENDLY"){
        neighbour.groupInstance.removeLiberties([position], groupId);
        if (neighbour.groupInstance.liberties.length < 1) {
          this.groupsHandler.removeGroup(neighbour.groupInstance.id);
        }
      }
    }
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
        debug(this.groupsHandler)
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
