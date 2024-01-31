import { GroupsHandler } from "./GroupsHandler/GroupsHandler.js";

export type Position = [number, number];
export type Color = "O" | "X";
export type GroupLocations = Array<Row>;
export type Square = "-" | number;
export type Row = Square[];
export type GroupLookup = Record<number, any>; // wierd error then doing typeof Group
export type BoardInstance = typeof Board;
export type GroupsHandlerInstance = any; //typeof GroupsHandler;
export type GameInstance = any; // typeof Game
export type Members = Array<[number, number]>;
export type LibertyTally = Record<number, number>;

export type PositionState = "EMPTY" | "FRIENDLY" | "UNFRIENDLY"

export interface NeighbourProps {
  type: PositionState;
  liberties: number;
  groupId: number;
  neighbouringGroups: number[];
}
