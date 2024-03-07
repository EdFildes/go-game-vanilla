import { GroupsHandler } from "./GroupsHandler/GroupsHandler.js";

export type Position = [number, number];
export type Color = "O" | "X";
export type GroupLocations = Array<Row>;
export type Square = "-" | number;
export type Row = Square[];
export type GroupLookup = Record<number, any>; // wierd error then doing typeof Group
export type GroupsHandlerInstance = any; //typeof GroupsHandler;
export type GroupInstance = any;
export type GameInstance = any; // typeof Game
export type Members = Position[]
export type LibertyTally = Record<number, number>;

export type PositionState = "EMPTY" | "FRIENDLY" | "UNFRIENDLY"

export interface NeighbourProps {
  type: PositionState;
  groupInstance: GroupInstance;
  neighbouringGroups: number[];
  position: Position;
}
