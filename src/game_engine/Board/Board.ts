import { GameInstance, GroupsHandlerInstance, Position } from "../types.js";
import { checkNeighbours } from "./helpers/checkNeighbours.js";
import { handleFriendlies } from "./helpers/handleFriendlies.js";
import { handleUnfriendlies } from "./helpers/handleUnfriendlies.js";
import { removeSurroundedGroups } from "./helpers/removeSurroundedGroups.js";

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
      (neighbour.type === "FRIENDLY" && neighbour.liberties > 1) || 
      (neighbour.type === "UNFRIENDLY" && neighbour.liberties === 1)
    )

    if(canMove){
      const groupId = handleFriendlies(neighbours, this.groupsHandler, position);

      // neighbours may have changed by this point due to groups being merged
      neighbours = checkNeighbours(this.groupsHandler, position, this.game);

      handleUnfriendlies(neighbours, this.groupsHandler, groupId);

      removeSurroundedGroups(neighbours, this.groupsHandler);

      return true

    } else {
      return false
    }
  }
};
