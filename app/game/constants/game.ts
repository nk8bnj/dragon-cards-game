import { DragonCardRiskType } from "../types/game.types";

export const gameInfo = {
  minBet: 1.00,
  maxBet: 1000,
  balance: 100000,
  maxDecimals: 2,
};

export const DEFAULT_RISK: DragonCardRiskType = DragonCardRiskType.CLASSIC;
export const DEFAULT_BET_VALUE: number = 1.00;
export const DEFAULT_LOCAL_BALANCE = 100000;

export const RISK_LIST: DragonCardRiskType[] = [
  DragonCardRiskType.LOW,
  DragonCardRiskType.MEDIUM,
  DragonCardRiskType.HIGH,
  DragonCardRiskType.CLASSIC,
];

export const multipliersList = {
  [DragonCardRiskType.CLASSIC]: [0, 3.5, 4, 0, 10, 7],
  [DragonCardRiskType.LOW]: [0, 1, 2, 1, 2.5, 1.5],
  [DragonCardRiskType.MEDIUM]: [0, 3, 5, 0, 6, 1.5],
  [DragonCardRiskType.HIGH]: [0, 0, 25, 0, 50, 0],
};

export const initialCards = [
  { id: 1, value: "A", img: "/images/cards/fire.png" },
  { id: 2, value: "B", img: "/images/cards/frost.png" },
  { id: 3, value: "C", img: "/images/cards/shadow.png" },
  { id: 4, value: "D", img: "/images/cards/storm.png" },
  { id: 5, value: "E", img: "/images/cards/earth.png" },
  { id: 6, value: "F", img: "/images/cards/empty.png" },
];

