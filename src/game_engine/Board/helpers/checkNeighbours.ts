import { getGroupColor } from "../../helpers";
import { GameInstance, GroupsHandlerInstance, NeighbourProps, Position, PositionState, Square } from "../../types";

// up right down left
export const directionOffsets: Array<[number, number]> = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const getType = (groupId: Square, groupsHandler: GroupsHandlerInstance, currentColor: string): PositionState => {
  if(groupId === "-" || getGroupColor(groupsHandler, groupId) === "-") return "EMPTY"
  if(getGroupColor(groupsHandler, groupId) === currentColor) return "FRIENDLY"
  else return "UNFRIENDLY"
}

const getNeighbouringGroups = (  
  groupsHandler: GroupsHandlerInstance,
  position: Position,
  game: GameInstance
  ) => {
  const [row, col] = position;

  const neighbouringGroups = directionOffsets
    .filter(
      ([rowOffset, columnOffset]) =>
        !(row + rowOffset < 0 || 
          col + columnOffset < 0 || 
          row + rowOffset > game.size - 1 ||
          col + columnOffset  > game.size - 1 
        )
    )
    .map(
      ([rowOffset, columnOffset]) => {
        const groupId = groupsHandler.groupLocations[row + rowOffset][col + columnOffset]
        const adjPosition = [row + rowOffset, col + columnOffset]
        return [adjPosition, groupId]
      }
    );

  return neighbouringGroups;
};

export const checkNeighbours = (
  groupsHandler: GroupsHandlerInstance,
  position: Position,
  game: GameInstance,
): Array<NeighbourProps> => {
  const neighbourGroupsIds = getNeighbouringGroups(groupsHandler, position, game)
  const neighbourProps = neighbourGroupsIds.map(([adjPosition, groupId]) => {
    const group = groupsHandler.groupLookup[groupId];
    return {
      type: getType(groupId, groupsHandler, game.currentColor),
      groupId: groupId === "-" ? null : groupId,
      liberties: group ? group.liberties : null,
      neighbouringGroups: getNeighbouringGroups(groupsHandler, adjPosition, game).map(group => group[1]).filter(id => typeof id === "number")
    };
  })
  return neighbourProps;
};