import { checkNeighbours, dirMap, handleFriendlies, handleUnfriendlies } from "./helpers.js";
import { GameInstance, GroupsHandlerInstance, Position } from "./types.js"

export const Board = class {
  groupsHandler: GroupsHandlerInstance;
  game: GameInstance;
  
  constructor(groupsHandler: GroupsHandlerInstance, game: GameInstance) {
    this.groupsHandler = groupsHandler;
    this.game = game;
  }

  makeMove(position: Position) {
    const neighbours = checkNeighbours(this.groupsHandler, position, this.game)
    handleUnfriendlies(neighbours, this.groupsHandler)
    handleFriendlies(neighbours, this.groupsHandler, position)
  }
}