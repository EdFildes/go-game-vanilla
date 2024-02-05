import { getLiberties } from "../../GroupsHandler/helpers/getLiberties";
import { getUniqueGroups } from "../../helpers";
import { GroupsHandlerInstance, NeighbourProps, Position } from "../../types";

export const handleFriendlies = (
  neighbours: Array<NeighbourProps>,
  groupsHandler: GroupsHandlerInstance,
  position: Position,
) => {
  // get list of unique friendly neighbouring ids
  const friendlyNeighbouringGroups = getUniqueGroups(neighbours, "FRIENDLY")
  const { liberties, occupations } = getLiberties(neighbours);

  let groupId;

  if(friendlyNeighbouringGroups.size === 0){  // create a solo group 
    groupId = groupsHandler.createNewGroup([position], liberties, occupations);
  } else {
    Array.from(friendlyNeighbouringGroups).forEach((groupId) => {
      const group = groupsHandler.groupLookup[groupId];
      group.removeLiberties([position]);
    });
  }

  if (friendlyNeighbouringGroups.size === 1) { // join the neighbouring group
    groupId = friendlyNeighbouringGroups.values().next().value;
    const { liberties, occupations } = getLiberties(neighbours, groupId);
    groupsHandler.joinExistingGroup(position, groupId, liberties, occupations);
  } else if (friendlyNeighbouringGroups.size > 1) {
    const { liberties, occupations } = getLiberties(neighbours);
    groupId = groupsHandler.createNewGroup([position], liberties, occupations);
    groupId = groupsHandler.bridgeGroups([
      ...Array.from(friendlyNeighbouringGroups),
      groupId,
    ]);
  } 

  return groupId;
};