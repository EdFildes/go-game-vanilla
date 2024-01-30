import { Group } from "./Group.js";
import { initialiseBoard } from "./helpers.js";
import {
  GameInstance,
  GroupLocations,
  GroupLookup,
  LibertyTally,
  Position,
} from "./types.js";

export const GroupsHandler = class {
  readonly gameInstance: GameInstance;
  groupLookup: GroupLookup = {};
  groupLocations: GroupLocations;
  id: number = 0;

  constructor(game: GameInstance) {
    this.gameInstance = game;
    this.groupLocations = initialiseBoard(game.size);
    this.getGroupColor(0);
  }

  createNewGroup(
    position: Position,
    liberties: number,
    libertyTally: LibertyTally,
  ) {
    const [row, col] = position;
    this.groupLookup[this.id] = new Group(
      this,
      position,
      this.gameInstance.currentColor,
      this.id,
      liberties,
      libertyTally,
    );
    this.groupLocations[row][col] = this.id;
    return this.id++;
  }

  addToExistingGroup(
    piecePosition: Position,
    idToJoin: number,
    liberties: number,
  ) {
    const group = this.groupLookup[idToJoin];
    group.addMember(piecePosition);
    group.addLiberties(liberties);
    const [rowPiece, colPiece] = piecePosition;
    this.groupLocations[rowPiece][colPiece] = group.id;
  }

  mergeGroups(groupIds: number[]) {
    const newId = groupIds[0];
    const members = groupIds.map((id) => this.groupLookup[id].members).flat();
    const liberties = groupIds.reduce(
      (total, id) => total + this.groupLookup[id].liberties,
      0,
    );
    const group = this.groupLookup[newId];
    group.setMembers(members);
    group.setLiberties(liberties - 1);
    // need to merge liberty tallies as well
    members.forEach(([row, col]) => (this.groupLocations[row][col] = newId));
    groupIds.slice(1).forEach((id) => delete this.groupLookup[id]);
  }

  removeGroup(groupId: number) {
    const group = this.groupLookup[groupId];
    group.members.forEach(
      ([row, col]: Position) => (this.groupLocations[row][col] = "-"),
    );
    Object.values(this.groupLookup).forEach((group) => {
      if (group.libertyTally[groupId]) {
        group.refundLiberties(groupId);
      }
    });
    delete this.groupLookup[groupId];
  }

  getGroupColor(id: number) {
    const group = this.groupLookup[id];
    return group ? group.color : "-";
  }
};
