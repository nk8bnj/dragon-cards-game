import { DragonCardRiskType } from "../types/game.types";
import { multipliersList } from "../constants/game";

export const getMultipliersByRisk = (risk: DragonCardRiskType): number[] => {
  return multipliersList[risk];
};

