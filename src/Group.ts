import { Color, GroupsHandlerInstance, Members, Position } from "./types.js";

export const Group = class {
  color: Color;
  id: number;
  liberties: number;
  members: Members = [];
  groupsHandler: GroupsHandlerInstance;
  libertyTally: Record<number, number> = {};

  constructor(groupsHandler: GroupsHandlerInstance, position: Position, color: Color, id: number, liberties: number) {
    this.groupsHandler = groupsHandler;
    this.color = color;
    this.id = id;
    this.liberties = liberties;
    const [row, col] = position;
    this.members.push([row, col])
  }

  addLiberties = (quantity: number, id: number) => {
    this.liberties += quantity
    this.libertyTally[id] = this.libertyTally[id] ? this.libertyTally[id]++ : 1
  }

  removeLiberties = (quantity: number) => {
    this.liberties -= quantity
    if(this.liberties === 0) {
      this.groupsHandler.removeGroup(this.id, this.members)
    }
  }

  setLiberties(quantity: number) {
    this.liberties = quantity
  }

  setMembers(members: Members) {
    this.members = members
  }

  addMember = (position: Position) => {
    const [row, col] = position;
    this.members.push([row, col]);
  }
}