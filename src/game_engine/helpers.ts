import {
  GroupsHandlerInstance,
  NeighbourProps,
  PositionState,
  Square
} from "./types";

export const initialiseBoard = (size: number) =>
  new Array(size).fill(null).map((_) => new Array(size).fill("-"));

export const getUniqueGroups = (neighbours: NeighbourProps[], type: PositionState) => new Set(
  neighbours
    .filter((neighbour) => neighbour.type === type)
    .map((neighbour) => neighbour.groupId),
);

export const getGroupColor = (groupsHandler: GroupsHandlerInstance, id: Square) => {
  const group = groupsHandler.groupLookup[id]
  return group ? group.color : "-"
}
