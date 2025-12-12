"use client";

import { memo, useCallback, useMemo } from "react";
import { useGameStore } from "../../store/gameStore";
import { useSoundStore } from "../../store/soundStore";
import Input from "../ui/Input";
import { gameInfo } from "../../constants/game";
import styles from "./BetInput.module.scss";

const inputSetters = ["1/2", "x2", "Max"] as const;

const BetInput = memo(() => {
  const playSound = useSoundStore(state => state.playSound);
  const bet = useGameStore(state => state.bet);
  const balance = useGameStore(state => state.balance);
  const setBet = useGameStore(state => state.setBet);
  const canMakeBet = balance - bet >= 0;

  const onInputButtonClick = useCallback(
    (value: typeof inputSetters[number]) => {
      playSound("click");
      setBet(value);
    },
    [playSound, setBet],
  );

  const inputButtons = useMemo(() => {
    return (
      <div className="inputButtons">
        {inputSetters.map(value => (
          <button
            className="inputButton"
            key={value}
            onClick={() => onInputButtonClick(value)}
          >
            {value}
          </button>
        ))}
      </div>
    );
  }, [onInputButtonClick]);

  return (
    <div className="inputContainer">
      <div className="inputLabel">Bet Amount</div>
      <div className={styles.betInputLabelContainer}>
        <span className={styles.betInputMaxBet}>Max bet: {gameInfo.maxBet.toFixed(gameInfo.maxDecimals)}</span>
        <span className={styles.betInputCurrency}>$</span>
      </div>
      <div
        data-in-error={!canMakeBet}
        className="inputWrapper"
        data-error-text={`Can't bet more than your balance`}
      >
        <Input
          id="bet-amount-input"
          value={bet}
          maxDecimals={gameInfo.maxDecimals}
          onValueChange={(val) => setBet(val)}
          min={gameInfo.minBet}
          max={gameInfo.maxBet}
        />
        {inputButtons}
      </div>
    </div>
  );
});

BetInput.displayName = "BetInput";

export default BetInput;

