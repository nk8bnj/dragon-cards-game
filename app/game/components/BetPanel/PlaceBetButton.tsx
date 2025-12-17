"use client";

import { memo, useCallback } from "react";
import { useGameStore } from "../../store/gameStore";
import { useSoundStore } from "../../store/soundStore";
import Button from "../ui/Button";

interface PlaceBetButtonProps {
  onPlaceBet: () => Promise<boolean>;
}

const PlaceBetButton = memo(({ onPlaceBet }: PlaceBetButtonProps) => {
  const playSound = useSoundStore(state => state.playSound);
  const bet = useGameStore(state => state.bet);
  const balance = useGameStore(state => state.balance);
  const canMakeBet = balance - bet >= 0;

  const handleClick = useCallback(async () => {
    const success = await onPlaceBet();
    if (success) {
      playSound("click");
    }
  }, [onPlaceBet, playSound]);

  return (
    <Button
      label="Place Bet"
      onClick={handleClick}
      disabled={!canMakeBet}
    />
  );
});

export default PlaceBetButton;

