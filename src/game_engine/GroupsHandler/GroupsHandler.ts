import { Group } from "../Group.js";
import { initialiseBoard } from "../helpers.js";
import {
  GameInstance,
  GroupLocations,
  GroupLookup,
  Position,
} from "../types.js";
import {mergeWith, uniq, concat} from "ramda";

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
    idToJoin: number, 
    members: Position[], 
    liberties: Position[], 
    occupations: Record<number, Position[]>
  ) {
    const group = this.groupLookup[idToJoin];
    group.members = members;
    group.liberties = liberties;
    group.occupations = occupations;
  }

  mergeGroups(newId: number, oldId: number) {
    let members: Position[] = [];
    let liberties: Position[] = [];
    let occupations = {};
    
    [newId, oldId].forEach((id) => {
      const group = this.groupLookup[id];

      members = members.concat(group.members);
      liberties = uniq(liberties.concat(group.liberties))
      occupations = mergeWith(concat,
        occupations,
        group.occupations
      )
    });

    members.forEach(([row, col]) => {
      this.groupLocations[row][col] = newId
    })

    this.joinExistingGroup(newId, members, liberties, occupations)

    // cleanup
    Object.values(this.groupLookup).forEach(group => {
      if(group.occupations[oldId]){
        group.occupations[newId] = group.occupations[oldId]
        delete group.occupations[oldId]
      }
    });

    delete this.groupLookup[oldId]
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
