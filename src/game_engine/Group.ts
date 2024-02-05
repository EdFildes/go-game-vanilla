import { without } from "ramda";
import {
  Color,
  GroupsHandlerInstance,
  Members,
  Position,
} from "./types.js";

export const Group = class {
  readonly color: Color;
  readonly id: number;
  liberties: Position[]
  members: Members = [];
  groupsHandler: GroupsHandlerInstance;
  occupations: Record<number, Position[]> = {};

  constructor(
    groupsHandler: GroupsHandlerInstance,
    members: Members, 
    color: Color,
    id: number,
    liberties: Position[],
    occupations: Record<number, Position[]>,
  ) {
    this.groupsHandler = groupsHandler;
    this.color = color;
    this.id = id;
    this.liberties = liberties;
    this.members = this.members.concat(members);
    this.occupations = occupations;
  }

  addLiberties(liberties: Position[]) {
    this.liberties = this.liberties.concat(liberties);
  }

  refundLiberties(groupId: number) {
    this.liberties = this.liberties.concat(this.occupations[groupId]);
    delete this.occupations[groupId];
  }

  removeLiberties = (liberties: Position[], unfriendlyGroupId: number) => {
    this.liberties = without(liberties, this.liberties);
    if(typeof unfriendlyGroupId === "number"){
      this.occupations[unfriendlyGroupId] = Array.isArray(this.occupations[unfriendlyGroupId]) ? 
      this.occupations[unfriendlyGroupId].concat(liberties) : 
      liberties
    }
  };

  addMember = (position: Position) => {
    const [row, col] = position;
    this.members.push([row, col]);
  };
};
