import {
  checkNeighbours,
  handleFriendlies,
  handleUnfriendlies,
  removeLibertiesFromNeighbours,
  removeSurroundedGroups,
} from "./helpers.js";
import { GameInstance, GroupsHandlerInstance, Position } from "./types.js";

export const Board = class {
  readonly groupsHandler: GroupsHandlerInstance;
  readonly game: GameInstance;

  constructor(groupsHandler: GroupsHandlerInstance, game: GameInstance) {
    this.groupsHandler = groupsHandler;
    this.game = game;
  }

  makeMove(position: Position) {
    let neighbours = checkNeighbours(this.groupsHandler, position, this.game);

    removeLibertiesFromNeighbours(neighbours, this.groupsHandler);

    const groupId = handleFriendlies(neighbours, this.groupsHandler, position);

    // neighbours may have changed by this point due to groups being merged
    neighbours = checkNeighbours(this.groupsHandler, position, this.game);

    handleUnfriendlies(neighbours, this.groupsHandler, groupId);

    removeSurroundedGroups(neighbours, this.groupsHandler);
  }
};
