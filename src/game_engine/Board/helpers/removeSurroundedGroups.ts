import { NeighbourProps, GroupsHandlerInstance } from "../../types";

export const removeSurroundedGroups = (
  neighbours: NeighbourProps[],
  groupsHandler: GroupsHandlerInstance,
) => {
  const neighbouringGroupIds = new Set(
    neighbours
      .filter((neighbour) => neighbour.type !== "EMPTY")
      .map((neighbour) => neighbour.groupId),
  );

  if (neighbouringGroupIds.size > 0) {
    Array.from(neighbouringGroupIds).forEach((groupId) => {
      const group = groupsHandler.groupLookup[groupId];
      if (group.liberties < 1) {
        groupsHandler.removeGroup(groupId);
      }
    });
  }
};