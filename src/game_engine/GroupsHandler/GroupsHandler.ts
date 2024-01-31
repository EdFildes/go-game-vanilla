import { Group } from "../Group.js";
import { initialiseBoard } from "../helpers.js";
import {
  GameInstance,
  GroupLocations,
  GroupLookup,
  LibertyTally,
  NeighbourProps,
  Position,
} from "../types.js";
import {mergeWith, add} from "ramda";
import { getLiberties } from "./helpers/getLiberties.js";

export const GroupsHandler = class {
  readonly gameInstance: GameInstance;
  groupLookup: GroupLookup = {};
  groupLocations: GroupLocations;
  id: number = 0;

  constructor(game: GameInstance) {
    this.gameInstance = game;
    this.groupLocations = initialiseBoard(game.size);
  }

  createNewGroup(
    members: Position[],
    liberties: number,
    libertyTally: LibertyTally
  ) {
    this.groupLookup[this.id] = new Group(
      this,
      members,
      this.gameInstance.currentColor,
      this.id,
      liberties,
      libertyTally,
    );
    members.forEach(position => {
      const [row, col] = position;
      this.groupLocations[row][col] = this.id;
    })
    return this.id++;
  }

  joinExistingGroup(
    piecePosition: Position,
    idToJoin: number,
    neighbours: NeighbourProps[],
  ) {
    const { liberties, libertyTally } = getLiberties(neighbours, idToJoin);
    const group = this.groupLookup[idToJoin];
    group.addMember(piecePosition);
    group.addLiberties(liberties);
    group.libertyTally = mergeWith(add, group.libertyTally, libertyTally)
    const [rowPiece, colPiece] = piecePosition;
    this.groupLocations[rowPiece][colPiece] = group.id;
  }

  bridgeGroups(oldGroupIds: number[]) {
    const members = oldGroupIds.map((id) => this.groupLookup[id].members).flat();

    let liberties = 0
    oldGroupIds.forEach(id => 
      liberties += this.groupLookup[id].liberties
    );

    let libertyTally = {}
    oldGroupIds.forEach(id => {
      const libertyTallyInner = this.groupLookup[id].libertyTally
      libertyTally = mergeWith(add,
        libertyTally,
        libertyTallyInner
      )
    })
    const newGroupId = this.createNewGroup(members, liberties, libertyTally)

    // cleanup
    Object.values(this.groupLookup).forEach(group => {
      oldGroupIds.forEach((oldId) => {
        group.libertyTally[newGroupId] = group.libertyTally[oldId]
        delete group.libertyTally[oldId]
      })
    })
    oldGroupIds.forEach((oldId) => delete this.groupLookup[oldId]); 

    return newGroupId
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
};
