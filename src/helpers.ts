import { GameInstance, GroupsHandlerInstance, NeighbourProps, Position } from "./types";

export const initialiseBoard = (size: number) => new Array(size).fill(null).map(_ => new Array(size).fill("-"))

// up right down left
export const directionOffsets: Array<[number, number]> = [[-1, 0],[0, 1],[1, 0],[0, -1]]

export const checkNeighbours = (groupsHandler: GroupsHandlerInstance, position: Position, game: GameInstance): Array<NeighbourProps> => {
  const [row, col] = position;

  const neighbourProps = directionOffsets.map(([rowOffset, columnOffset]) => {
    const groupId = groupsHandler.groupLocations[row + rowOffset][col + columnOffset]]
    return {
      groupId: groupId,
      isFriendly: groupsHandler.getGroupColor(groupId) === game.currentColor,
      isEmpty: groupId === "-"
    }
  })
  console.log(neighbourProps) // DEBUG

  return neighbourProps
}

export const handleUnfriendlies = (neighbours: Array<NeighbourProps>, groupsHandler: GroupsHandlerInstance) => {
  // get list of unique unfriendly neighbouring ids
  const unFriendlyNeighbouringGroups = new Set(neighbours
    .filter(neighbour => !neighbour.isFriendly && !neighbour.isEmpty)
    .map((neighbour => neighbour.groupId))
  )
  
  if(unFriendlyNeighbouringGroups.size > 0){
    Array.from(unFriendlyNeighbouringGroups).forEach(groupId => {
      const group = groupsHandler.groupLookup[groupId]
      console.log("removing libs", groupId, group.liberties) // DEBUG
      // remove a liberty from each of the unfriendly neighbouring groups
      group.removeLiberties(1)
    })
  }
}

export const handleFriendlies = (neighbours: Array<NeighbourProps>, groupsHandler: GroupsHandlerInstance, position: Position) => {
  // get list of unique friendly neighbouring ids
  const friendlyNeighbouringGroups = new Set(neighbours
    .filter(neighbour => neighbour.isFriendly)
    .map((neighbour => neighbour.groupId))
  )

  const liberties = neighbours.reduce((total, neighbour) => neighbour.isEmpty ? total + 1 : total, 0);

  if(friendlyNeighbouringGroups.size > 1){
    console.log(liberties) // DEBUG
    const newGroupId = groupsHandler.createNewGroup(position, liberties)
    // bridge the neighbouring groups in to one group
    groupsHandler.mergeGroups([...Array.from(friendlyNeighbouringGroups), newGroupId])
  } else if(friendlyNeighbouringGroups.size === 1){
    const neighbourId = friendlyNeighbouringGroups.values().next().value();
    // join the neighbouring group
    groupsHandler.addToExistingGroup(position, neighbourId, liberties)
  } else {
    console.log("creating group", position, liberties) // DEBUG
    // create a solo group
    groupsHandler.createNewGroup(position, liberties)
  }
}