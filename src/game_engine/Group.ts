import {
  Color,
  GroupsHandlerInstance,
  LibertyTally,
  Members,
  Position,
} from "./types.js";

export const Group = class {
  readonly color: Color;
  readonly id: number;
  liberties: number;
  members: Members = [];
  groupsHandler: GroupsHandlerInstance;
  libertyTally: Record<number, number> = {};

  constructor(
    groupsHandler: GroupsHandlerInstance,
    position: Position,
    color: Color,
    id: number,
    liberties: number,
    libertyTally: LibertyTally,
  ) {
    this.groupsHandler = groupsHandler;
    this.color = color;
    this.id = id;
    this.liberties = liberties;
    const [row, col] = position;
    this.members.push([row, col]);
    this.libertyTally = libertyTally;
  }

  addLiberties(quantity: number) {
    this.liberties += quantity;
  }

  refundLiberties(groupId: number) {
    this.liberties += this.libertyTally[groupId];
    delete this.libertyTally[groupId];
  }

  removeLiberties = (quantity: number, groupId?: number) => {
    this.liberties -= quantity;
    if (groupId) {
      this.libertyTally[groupId] = this.libertyTally[groupId]
        ? this.libertyTally[groupId] + quantity
        : quantity;
    }
  };

  setLiberties(quantity: number) {
    this.liberties = quantity;
  }

  setMembers(members: Members) {
    this.members = members;
  }

  addMember = (position: Position) => {
    const [row, col] = position;
    this.members.push([row, col]);
  };
};