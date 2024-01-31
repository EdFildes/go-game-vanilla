import { getUniqueGroups } from "../../helpers";
import { NeighbourProps, GroupsHandlerInstance } from "../../types";

export const handleUnfriendlies = (
  neighbours: Array<NeighbourProps>,
  groupsHandler: GroupsHandlerInstance,
  groupIdMain: number,
) => {
  // get list of unique unfriendly neighbouring ids
  const unFriendlyNeighbouringGroups = getUniqueGroups(neighbours, "UNFRIENDLY")

  if (unFriendlyNeighbouringGroups.size > 0) {
    Array.from(unFriendlyNeighbouringGroups).forEach((groupId) => {
      console.log("unfreindly group: ",groupId)
      const group = groupsHandler.groupLookup[groupId];
      // remove a liberty from each of the unfriendly neighbouring groups
      group.removeLiberties(1, groupIdMain);
    });
  }
};