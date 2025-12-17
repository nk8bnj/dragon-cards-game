"use client";

import { memo } from "react";
import styles from "./CardGrid.module.scss";

interface MultiplierLabelProps {
  multiplier: number;
  cardId: number;
  isMatched: boolean;
}

const MultiplierLabel = memo(({ multiplier, cardId, isMatched }: MultiplierLabelProps) => {
  const getMatchColor = () => {
    if (isMatched) {
      return multiplier > 0 ? "#53d859" : "#f03030";
    }
    return "white";
  };

  return (
    <div
      style={{
        color: getMatchColor(),
      }}
      className={styles.iconContainer}
    >
      {multiplier === 0 ? "LOST" : `${multiplier}x`}
    </div>
  );
});

export default MultiplierLabel;

