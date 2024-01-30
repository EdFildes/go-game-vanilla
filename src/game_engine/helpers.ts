import {
  GameInstance,
  GroupsHandlerInstance,
  NeighbourProps,
  Position,
} from "./types";

export const initialiseBoard = (size: number) =>
  new Array(size).fill(null).map((_) => new Array(size).fill("-"));

// up right down left
export const directionOffsets: Array<[number, number]> = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

export const checkNeighbours = (
  groupsHandler: GroupsHandlerInstance,
  position: Position,
  game: GameInstance,
): Array<NeighbourProps> => {
  const [row, col] = position;

  const neighbourProps = directionOffsets
    .filter(
      ([rowOffset, columnOffset]) =>
        !(row + rowOffset < 0 || col + columnOffset < 0),
    )
    .map(([rowOffset, columnOffset]) => {
      const groupId =
        groupsHandler.groupLocations[row + rowOffset][col + columnOffset];
      return {
        groupId: groupId,
        isFriendly: groupsHandler.getGroupColor(groupId) === game.currentColor,
        isEmpty: groupId === "-",
      };
    });

  return neighbourProps;
};

const getLiberties = (neighbours: NeighbourProps[]) => {
  const liberties = neighbours.reduce(
    (total, neighbour) => (neighbour.isEmpty ? total + 1 : total),
    0,
  );

  const libertyTally: Record<number, number> = {};

  neighbours.forEach((neighbour) => {
    if (!neighbour.isFriendly && !neighbour.isEmpty) {
      const groupId = neighbour.groupId;
      libertyTally[groupId] = libertyTally[groupId]
        ? libertyTally[groupId] + 1
        : 1;
    }
  });

  return { liberties, libertyTally };
};

export const handleUnfriendlies = (
  neighbours: Array<NeighbourProps>,
  groupsHandler: GroupsHandlerInstance,
  groupIdMain: number,
) => {
  // get list of unique unfriendly neighbouring ids
  const unFriendlyNeighbouringGroups = new Set(
    neighbours
      .filter((neighbour) => !neighbour.isFriendly && !neighbour.isEmpty)
      .map((neighbour) => neighbour.groupId),
  );

  if (unFriendlyNeighbouringGroups.size > 0) {
    Array.from(unFriendlyNeighbouringGroups).forEach((groupId) => {
      const group = groupsHandler.groupLookup[groupId];
      // remove a liberty from each of the unfriendly neighbouring groups
      group.removeLiberties(1, groupIdMain);
    });
  }
};

export const handleFriendlies = (
  neighbours: Array<NeighbourProps>,
  groupsHandler: GroupsHandlerInstance,
  position: Position,
) => {
  // get list of unique friendly neighbouring ids
  const friendlyNeighbouringGroups = new Set(
    neighbours
      .filter((neighbour) => neighbour.isFriendly)
      .map((neighbour) => neighbour.groupId),
  );

  const { liberties, libertyTally } = getLiberties(neighbours);

  let groupId;

  if (friendlyNeighbouringGroups.size > 1) {
    groupId = groupsHandler.createNewGroup(position, liberties, libertyTally);
    // bridge the neighbouring groups in to one group
    groupsHandler.mergeGroups([
      ...Array.from(friendlyNeighbouringGroups),
      groupId,
    ]);
  } else if (friendlyNeighbouringGroups.size === 1) {
    groupId = friendlyNeighbouringGroups.values().next().value;
    // join the neighbouring group
    groupsHandler.addToExistingGroup(position, groupId, liberties);
  } else {
    // create a solo group
    groupId = groupsHandler.createNewGroup(position, liberties, libertyTally);
  }

  return groupId;
};

export const removeLibertiesFromNeighbours = (
  neighbours: NeighbourProps[],
  groupsHandler: GroupsHandlerInstance,
) => {
  const friendlyNeighbouringGroups = new Set(
    neighbours
      .filter((neighbour) => neighbour.isFriendly && !neighbour.isEmpty)
      .map((neighbour) => neighbour.groupId),
  );

  if (friendlyNeighbouringGroups.size > 0) {
    Array.from(friendlyNeighbouringGroups).forEach((groupId) => {
      const group = groupsHandler.groupLookup[groupId];
      // remove a liberty from each of the neighbouring groups
      group.removeLiberties(1);
    });
  }
};

export const removeSurroundedGroups = (
  neighbours: NeighbourProps[],
  groupsHandler: GroupsHandlerInstance,
) => {
  const neighbouringGroupIds = new Set(
    neighbours
      .filter((neighbour) => !neighbour.isEmpty)
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
