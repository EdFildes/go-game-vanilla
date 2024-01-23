import { Group } from "./Group.js";
import { initialiseBoard } from "./helpers.js";
import { GameInstance, GroupLocations, GroupLookup, Members, Position } from "./types.js";

export const GroupsHandler = class {
  groupLookup: GroupLookup = {}
  groupLocations: GroupLocations;
  id: number = 0;
  gameInstance: GameInstance;

  constructor(game: GameInstance){
    this.gameInstance = game;
    this.groupLocations = initialiseBoard(game.size);
    this.getGroupColor(0)
  }

  createNewGroup(position: Position, liberties: number){
    const [row, col] = position; 
    this.groupLookup[this.id] = new Group(this, position, this.gameInstance.currentColor, this.id, liberties)
    this.groupLocations[row][col] = this.id
    return this.id++
  }

  addToExistingGroup(piecePosition: Position, idToJoin: number, liberties: number) {
    const group = this.groupLookup[idToJoin]
    group.addMember(piecePosition)
    group.addLiberties(liberties - 1)
    const [rowPiece, colPiece] = piecePosition;
    this.groupLocations[rowPiece][colPiece] = group.id;
  }

  mergeGroups(groupIds: number[]) {
    const newId = groupIds[0]
    const members = groupIds.map(id => this.groupLookup[id].members).flat()
    const liberties = groupIds.reduce((total, id) => total + this.groupLookup[id].liberties, 0)
    const group = this.groupLookup[newId]
    group.setMembers(members)
    group.setLiberties(liberties)
    members.forEach(([row, col]) => this.groupLocations[row][col] = newId)
    groupIds.slice(1).forEach(id => delete this.groupLookup[id])
  }

  removeGroup(groupId: number, members: Members) {
    members.forEach(([row, col]) => this.groupLocations[row][col] = "-")
    delete this.groupLookup[groupId]
  }

  getGroupColor(id: number) {
    const group = this.groupLookup[id]
    return group ? group.color : "-"
  }
}