import { getLiberties } from "../GroupsHandler/helpers/getLiberties.js";
import { GameInstance, GroupsHandlerInstance, Position } from "../types.js";
import { checkNeighbours } from "./helpers/checkNeighbours.js";

export const Board = class {
  readonly groupsHandler: GroupsHandlerInstance;
  readonly game: GameInstance;

  constructor(groupsHandler: GroupsHandlerInstance, game: GameInstance) {
    this.groupsHandler = groupsHandler;
    this.game = game;
  }

  makeMove(position: Position) {
    let neighbours = checkNeighbours(this.groupsHandler, position, this.game);

    const canMove = neighbours.some(neighbour => 
      neighbour.type === "EMPTY" || 
      (neighbour.type === "FRIENDLY" && neighbour.groupInstance.liberties.length > 1) || 
      (neighbour.type === "UNFRIENDLY" && neighbour.groupInstance.liberties.length === 1)
    )

    if(canMove){

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

      return true
    } else {
      return false
    }
  }
};
