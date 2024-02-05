import { NeighbourProps, Position } from "../../types";

export const getLiberties = (neighbours: NeighbourProps[], newGroupId?: number) => {
  let liberties: Position[] = [];
  const occupations: Record<number, Position[]> = {};

  for(let neighbour of neighbours){
    // check to see if the liberty is already accounted for by the group you're joining
    if(typeof newGroupId === "number" && neighbour.type === "EMPTY" && neighbour.neighbouringGroups.includes(newGroupId)){
      continue
    } else if(neighbour.type === "EMPTY") {
      liberties = liberties.concat([neighbour.position])
    } else if(neighbour.type === "UNFRIENDLY"){
      const groupId = neighbour.groupInstance.id;
      occupations[groupId] = Array.isArray(occupations[groupId]) ? 
        occupations[groupId].concat(neighbour.position) : 
        [neighbour.position]
    }
  }

  return { liberties, occupations };
};