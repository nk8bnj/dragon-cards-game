"use client";

import { useGame } from "./hooks/useGame";
import { useBalance } from "./hooks/useBalance";
import CardGrid from "./components/GameBoard/CardGrid";
import BetInput from "./components/BetPanel/BetInput";
import RiskSelector from "./components/BetPanel/RiskSelector";
import PlaceBetButton from "./components/BetPanel/PlaceBetButton";
import SoundController from "./components/SoundController/SoundController";
import styles from "./page.module.scss";

export default function GamePage() {
  const { makeBet } = useGame();
  const { formattedBalance } = useBalance();

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.balanceContainer} data-mobile={true}>
        <span className={styles.balanceLabel}>Balance:</span>
        <span className={styles.balanceValue}>{formattedBalance}</span>
      </div>
      <div className={styles.gameContainer}>
        <div className={styles.sidebar}>
          <div className={styles.actions}>
            <BetInput />
            <RiskSelector />
            <PlaceBetButton onPlaceBet={makeBet} />
            <div className={styles.balanceContainer} data-mobile={false}>
              <span className={styles.balanceLabel}>Balance:</span>
              <span className={styles.balanceValue}>{formattedBalance}</span>
            </div>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.soundControllerWrapper}>
            <SoundController />
          </div>
          <CardGrid />
        </div>
      </div>
    </div>
  );
}
