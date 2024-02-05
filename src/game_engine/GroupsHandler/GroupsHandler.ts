import { Group } from "../Group.js";
import { initialiseBoard } from "../helpers.js";
import {
  GameInstance,
  GroupLocations,
  GroupLookup,
  Position,
} from "../types.js";
import {mergeWith, add, uniq, concat} from "ramda";
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
    liberties: Position[],
    occupations: Record<number, Position[]>
  ) {
    this.groupLookup[this.id] = new Group(
      this,
      members,
      this.gameInstance.currentColor,
      this.id,
      liberties,
      occupations,
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
    liberties: Position[],
    occupations: Position[]
  ) {
    const group = this.groupLookup[idToJoin];
    group.addMember(piecePosition);
    group.addLiberties(liberties);
    group.occupations = mergeWith(concat, group.occupations, occupations)
    const [rowPiece, colPiece] = piecePosition;
    this.groupLocations[rowPiece][colPiece] = group.id;
  }

  bridgeGroups(oldGroupIds: number[]) {
    const members = oldGroupIds.map((id) => this.groupLookup[id].members).flat();

    let liberties: Position[] = []
    oldGroupIds.forEach(id => 
      liberties = uniq(liberties.concat(this.groupLookup[id].liberties))
    );

    let occupations = {}
    oldGroupIds.forEach(id => {
      const occupationsInner = this.groupLookup[id].occupations
      occupations = mergeWith(concat,
        occupations,
        occupationsInner
      )
    })
    const newGroupId = this.createNewGroup(members, liberties, occupations)

    // cleanup
    Object.values(this.groupLookup).forEach(group => {
      oldGroupIds.forEach((oldId) => {
        if(group.occupations[oldId]){
          group.occupations[newGroupId] = group.occupations[oldId]
          delete group.occupations[oldId]
        }
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
      if (group.occupations[groupId]) {
        group.refundLiberties(groupId);
      }
    });
    delete this.groupLookup[groupId];
  }
};
