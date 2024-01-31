import { NeighbourProps } from "../../types";

export const getLiberties = (neighbours: NeighbourProps[], newGroupId?: number) => {
  let liberties = 0;
  const libertyTally: Record<number, number> = {};

  for(let neighbour of neighbours){
    // check to see if the liberty is already accounted for by the group you're joining
    if(typeof newGroupId === "number" && neighbour.type === "EMPTY" && neighbour.neighbouringGroups.includes(newGroupId)){
      continue
    } else if(neighbour.type === "EMPTY") {
      liberties++
    } else if(neighbour.type === "UNFRIENDLY"){
      const groupId = neighbour.groupId;
      libertyTally[groupId] = 1
    }
  }

  return { liberties, libertyTally };
};