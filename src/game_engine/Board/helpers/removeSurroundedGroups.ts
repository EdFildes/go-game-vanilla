import { NeighbourProps, GroupsHandlerInstance } from "../../types";

export const removeSurroundedGroups = (
  neighbours: NeighbourProps[],
  groupsHandler: GroupsHandlerInstance,
) => {
  const neighbouringGroupIds = new Set(
    neighbours
      .filter((neighbour) => neighbour.type === "UNFRIENDLY")
      .map((neighbour) => neighbour.groupInstance.id),
  );

  if (neighbouringGroupIds.size > 0) {
    Array.from(neighbouringGroupIds).forEach((groupId) => {
      const group = groupsHandler.groupLookup[groupId];
      if (group.liberties.length < 1) {
        groupsHandler.removeGroup(groupId);
      }
    });
  }
};