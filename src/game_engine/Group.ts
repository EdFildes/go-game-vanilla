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

  removeLiberties = (liberties: Position[], groupId: number) => {
    this.liberties = without(liberties, this.liberties);
    if(typeof groupId === "number"){
      this.occupations[groupId] = Array.isArray(this.occupations[groupId]) ? 
      this.occupations[groupId].concat(liberties) : 
      liberties
    }
  };

  addMember = (position: Position) => {
    const [row, col] = position;
    this.members.push([row, col]);
  };
};
