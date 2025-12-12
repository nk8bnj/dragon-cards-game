"use client";

import { useCallback } from "react";
import { useGameStore } from "../store/gameStore";
import gameService from "../api/gameService";

export const useGame = () => {
  const {
    bet,
    risk,
    gameResult,
    isGameProcessing,
    selectedIndex,
    resultCards,
    matches,
    cards,
    placeBet,
    setGameResult,
    setSelectedIndex,
    isProcessing,
  } = useGameStore();

  const makeBet = useCallback(async () => {
    const success = await placeBet();
    if (!success) return false;

    try {
      const response = await gameService.getResult();
      setGameResult(response);
      return true;
    } catch {
      return false;
    }
  }, [placeBet, setGameResult]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (isGameProcessing || isProcessing) return;

      if (selectedIndex === null) {
        setSelectedIndex(index);
      } else {
        useGameStore.getState().swapCards(selectedIndex, index);
        setSelectedIndex(null);
      }
    },
    [isGameProcessing, isProcessing, selectedIndex, setSelectedIndex]
  );

  return {
    bet,
    risk,
    gameResult,
    isGameProcessing,
    selectedIndex,
    resultCards,
    matches,
    makeBet,
    handleCardClick,
  };
};

