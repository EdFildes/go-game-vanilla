import { getUniqueGroups } from "../../helpers";
import { NeighbourProps, GroupsHandlerInstance, Position } from "../../types";

export const handleUnfriendlies = (
  neighbours: Array<NeighbourProps>,
  groupsHandler: GroupsHandlerInstance,
  position: Position,
  moveGroupId: number
) => {
  // get list of unique unfriendly neighbouring ids
  const unFriendlyNeighbouringGroups = getUniqueGroups(neighbours, "UNFRIENDLY")

  if (unFriendlyNeighbouringGroups.size > 0) {
    console.log(Array.from(unFriendlyNeighbouringGroups))
    Array.from(unFriendlyNeighbouringGroups).forEach((groupId) => {
      const group = groupsHandler.groupLookup[groupId];
      // remove a liberty from each of the unfriendly neighbouring groups
      group.removeLiberties([position], moveGroupId);
    });
  }
};