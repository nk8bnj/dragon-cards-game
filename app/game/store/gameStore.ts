"use client";

import { create } from "zustand";
import { DragonCardRiskType, BetModification, GameInfo, Card } from "../types/game.types";
import { DEFAULT_RISK, DEFAULT_BET_VALUE, DEFAULT_LOCAL_BALANCE, gameInfo, initialCards } from "../constants/game";
import { normalizeBetSize, waitAsync } from "../utils";
import { getMultipliersByRisk } from "../utils/generateMultipliers";
import { calculateWin } from "../utils/calculateWin";
import { useSoundStore } from "./soundStore";

interface GameStore {
  bet: number;
  risk: DragonCardRiskType;
  balance: number;
  gameResult: GameInfo | null;
  isGameProcessing: boolean;
  selectedIndex: number | null;
  resultCards: { id: number; value: string; img: string }[];
  matches: number[];
  cards: Card[];
  isProcessing: boolean;

  setBet: (bet: BetModification) => void;
  setRisk: (risk: DragonCardRiskType) => void;
  placeBet: () => Promise<boolean>;
  updateBalance: (amount: number) => void;
  setGameResult: (result: GameInfo | null) => Promise<void>;
  setIsGameProcessing: (processing: boolean) => void;
  setSelectedIndex: (index: number | null) => void;
  setResultCards: (cards: { id: number; value: string; img: string }[]) => void;
  setMatches: (matches: number[]) => void;
  setCards: (cards: Card[]) => void;
  swapCards: (sourceIndex: number, targetIndex: number) => void;
  resetGame: () => void;
  processGameResult: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => {
  return {
    bet: DEFAULT_BET_VALUE,
    risk: DEFAULT_RISK,
    balance: DEFAULT_LOCAL_BALANCE,
    gameResult: null,
    isGameProcessing: false,
    selectedIndex: null,
    resultCards: [],
    matches: [],
    cards: initialCards,
    isProcessing: false,

    setBet: (betModification: BetModification) => {
      const currentBet = get().bet;
      const balance = get().balance;
      
      if (typeof betModification === "string") {
        switch (betModification) {
          case "1/2":
            set({ bet: normalizeBetSize(currentBet / 2, gameInfo.minBet, gameInfo.maxBet) });
            break;
          case "x2":
            set({ bet: normalizeBetSize(currentBet * 2, gameInfo.minBet, gameInfo.maxBet) });
            break;
          case "Max":
            set({ bet: normalizeBetSize(balance, gameInfo.minBet, gameInfo.maxBet) });
            break;
        }
      } else {
        set({ bet: normalizeBetSize(betModification, gameInfo.minBet, gameInfo.maxBet) });
      }
    },

    setRisk: (risk: DragonCardRiskType) => {
      set({ risk, matches: [] });
    },

    placeBet: async () => {
      const { bet, balance } = get();
      
      if (bet < gameInfo.minBet || bet > gameInfo.maxBet) {
        return false;
      }

      if (balance < bet) {
        return false;
      }

      return true;
    },

    updateBalance: (amount: number) => {
      const newBalance = get().balance + amount;
      const flooredValue = Math.floor(newBalance * 100) / 100;
      set({ balance: flooredValue });
    },

    setGameResult: async (result: GameInfo | null) => {
      set({ gameResult: result });
      if (result) {
        get().processGameResult();
      }
    },

    setIsGameProcessing: (processing: boolean) => {
      set({ isGameProcessing: processing });
    },

    setSelectedIndex: (index: number | null) => {
      set({ selectedIndex: index });
    },

    setResultCards: (cards: { id: number; value: string; img: string }[]) => {
      set({ resultCards: cards });
    },

    setMatches: (matches: number[]) => {
      set({ matches });
    },

    setCards: (cards: Card[]) => {
      set({ cards });
    },

    swapCards: (sourceIndex: number, targetIndex: number) => {
      const currentCards = get().cards;
      if (
        sourceIndex === targetIndex ||
        sourceIndex < 0 ||
        targetIndex < 0 ||
        sourceIndex >= currentCards.length ||
        targetIndex >= currentCards.length
      ) {
        return;
      }
      const swapped = [...currentCards];
      [swapped[sourceIndex], swapped[targetIndex]] = [swapped[targetIndex], swapped[sourceIndex]];
      set({ cards: swapped });
    },

    resetGame: () => {
      set({
        gameResult: null,
        isGameProcessing: false,
        selectedIndex: null,
        resultCards: [],
        matches: [],
        cards: initialCards,
        isProcessing: false,
      });
    },

    processGameResult: async () => {
      const state = get();
      if (state.isProcessing || !state.gameResult) return;
      
      set({ 
        isProcessing: true,
        isGameProcessing: true,
        resultCards: [],
        matches: [],
      });

      const playSound = useSoundStore.getState().playSound;
      playSound("reveal");
      
      await waitAsync(1200);

      const resultingArray: Card[] = [];
      const newResultCards: Card[] = [];
      const currentCards = state.cards;
      const lr = state.gameResult;

      if (lr.serverCards) {
        for (let index = 0; index < lr.serverCards.length; index++) {
          const randomCard = lr.serverCards[index];
          resultingArray.push(randomCard);
          newResultCards.push(randomCard);
          set({ resultCards: [...newResultCards] });
          playSound("cardFlip");
          await waitAsync(200);
        }

        await waitAsync(300);

        const multipliers = getMultipliersByRisk(state.risk);
        const finalMatches: number[] = [];
        const matchedCardIds: number[] = [];
        
        for (let index = 0; index < resultingArray.length; index++) {
          const card = currentCards[index];
          if (card && resultingArray[index].id === card.id) {
            finalMatches.push(index);
            matchedCardIds.push(card.id);
            set({ matches: [...matchedCardIds] });
            playSound("reward");
            await waitAsync(400);
          }
        }

        const winAmount = calculateWin(finalMatches, multipliers, state.bet);
        if (winAmount > 0) {
          get().updateBalance(winAmount);
        } else if (finalMatches.length > 0) {
          get().updateBalance(-state.bet);
        }

        await waitAsync(1000);
        get().resetGame();
        set({ isProcessing: false });
      } else {
        set({ isProcessing: false });
      }
    },
  };
});

