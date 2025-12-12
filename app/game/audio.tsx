"use client";

import { useEffect } from "react";
import { useSoundStore, getAudioList } from "./store/soundStore";

export default function AudioInitializer() {
  const initializeAudio = useSoundStore(state => state.initializeAudio);
  const isMobile = useSoundStore(state => state.isMobile);
  const audioList = useSoundStore(state => state.audioList);
  const isSoundEnabled = useSoundStore(state => state.isSoundEnabled);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  useEffect(() => {
    if (typeof window === "undefined" || !audioList) return;

    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        const oldAudioList = useSoundStore.getState().audioList;
        const newAudioList = getAudioList(newIsMobile);
        const currentIsSoundEnabled = useSoundStore.getState().isSoundEnabled;
        
        Object.values(newAudioList).forEach(howl => howl.mute(!currentIsSoundEnabled));
        
        if (oldAudioList) {
          Object.values(oldAudioList).forEach(howl => howl.unload());
        }
        
        useSoundStore.setState({ audioList: newAudioList, isMobile: newIsMobile });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, audioList]);

  return null;
}

