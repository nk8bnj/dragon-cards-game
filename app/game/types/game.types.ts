export enum DragonCardRiskType {
  CLASSIC = "CLASSIC",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type DragonCardRiskTypes = "LOW" | "MEDIUM" | "HIGH" | "CLASSIC";

export interface Card {
  id: number;
  value: string;
  img: string;
}

export interface GameInfo {
  serverCards: Card[];
  roundId: number;
}

export interface GameState {
  bet: number;
  risk: DragonCardRiskType;
  balance: number;
  gameResult: GameInfo | null;
  isGameProcessing: boolean;
  selectedIndex: number | null;
  resultCards: Card[];
  matches: number[];
}

export type BetModification = "1/2" | "x2" | "Max" | number;

