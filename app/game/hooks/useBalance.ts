"use client";

import { useGameStore } from "../store/gameStore";

export const useBalance = () => {
  const balance = useGameStore(state => state.balance);
  const updateBalance = useGameStore(state => state.updateBalance);

  return {
    balance,
    updateBalance,
    formattedBalance: balance.toFixed(2),
  };
};

