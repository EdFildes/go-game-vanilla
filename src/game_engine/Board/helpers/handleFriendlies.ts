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

  let groupId;
  const { liberties, libertyTally } = getLiberties(neighbours);

  if(friendlyNeighbouringGroups.size === 0){  // create a solo group 
    groupId = groupsHandler.createNewGroup([position], liberties, libertyTally);
  } else {
    Array.from(friendlyNeighbouringGroups).forEach((groupId) => {
      const group = groupsHandler.groupLookup[groupId];
      group.removeLiberties(1);
    });
  }

  if (friendlyNeighbouringGroups.size === 1) { // join the neighbouring group
    groupId = friendlyNeighbouringGroups.values().next().value;
    groupsHandler.joinExistingGroup(position, groupId, neighbours);
  } else if (friendlyNeighbouringGroups.size > 1) {
    groupId = groupsHandler.createNewGroup([position], liberties, libertyTally);
    groupId = groupsHandler.bridgeGroups([
      ...Array.from(friendlyNeighbouringGroups),
      groupId,
    ]);

    console.log(groupId, "joined")
  } 

  return groupId;
};