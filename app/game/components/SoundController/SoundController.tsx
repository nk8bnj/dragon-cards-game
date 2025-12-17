"use client";

import { memo, useMemo } from "react";
import { useSoundStore } from "../../store/soundStore";
import styles from "./SoundController.module.scss";

const SoundController = memo(() => {
  const isSoundEnabled = useSoundStore(state => state.isSoundEnabled);
  const toggleSound = useSoundStore(state => state.toggleSound);

  const iconSrc = useMemo(() => {
    return isSoundEnabled ? "/images/sound-on.svg" : "/images/sound-off.svg";
  }, [isSoundEnabled]);

  return (
    <button className={styles.muteButton} onClick={toggleSound}>
      <img alt="sound" src={iconSrc} height={25} width={25} />
    </button>
  );
});

export default SoundController;

