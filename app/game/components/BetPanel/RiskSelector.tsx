"use client";

import { memo, useCallback } from "react";
import { useGameStore } from "../../store/gameStore";
import { useSoundStore } from "../../store/soundStore";
import { RISK_LIST } from "../../constants/game";
import { DragonCardRiskType } from "../../types/game.types";
import styles from "./RiskSelector.module.scss";

const RiskSelector = memo(() => {
  const playSound = useSoundStore(state => state.playSound);
  const risk = useGameStore(state => state.risk);
  const setRisk = useGameStore(state => state.setRisk);
  const isGameProcessing = useGameStore(state => state.isGameProcessing);

  const handleClick = useCallback(
    (value: DragonCardRiskType) => () => {
      playSound("click");
      setRisk(value);
    },
    [playSound, setRisk],
  );

  const isActive = (value: DragonCardRiskType) => {
    return risk === value;
  };

  return (
    <div className="inputContainer">
      <div className="inputLabel">Risk</div>
      <div className={styles.riskButtons}>
        {RISK_LIST.map((value, index) => (
          <button
            key={`risk-${index}`}
            className={styles.riskButton}
            disabled={isGameProcessing || isActive(value)}
            data-active={isActive(value)}
            onClick={handleClick(value)}
          >
            {value.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
});

export default RiskSelector;

