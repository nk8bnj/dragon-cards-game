"use client";

import { create } from "zustand";
import { Howl } from "howler";

const LOCAL_STORAGE_KEY_SOUND = "Game sounds";

export const getAudioList = (isMobile: boolean) => ({
  bet: new Howl({
    src: ["/sounds/bet.mp3"],
    html5: isMobile,
    volume: 0.8,
  }),
  result: new Howl({
    src: ["/sounds/result.mp3"],
    html5: isMobile,
    volume: 0.8,
  }),
  click: new Howl({
    src: ["/sounds/click.wav"],
    html5: isMobile,
    volume: 1,
  }),
  reveal: new Howl({
    src: ["/sounds/reveal.mp3"],
    html5: isMobile,
    volume: 1,
  }),
  cardFlip: new Howl({
    src: ["/sounds/card-flip.mp3"],
    html5: isMobile,
    volume: 1,
    rate: 6,
  }),
  reward: new Howl({
    src: ["/sounds/reward.mp3"],
    html5: isMobile,
    volume: 1,
    rate: 2.5,
  }),
});

export type AudioKey = keyof ReturnType<typeof getAudioList>;

interface SoundStore {
  isSoundEnabled: boolean;
  audioList: Record<AudioKey, Howl> | null;
  isMobile: boolean;

  initializeAudio: () => void;
  playSound: (soundKey: AudioKey) => number;
  toggleSound: () => void;
  muteSound: () => void;
  unmuteSound: () => void;
}

export const useSoundStore = create<SoundStore>((set, get) => {
  const getInitialSoundEnabled = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SOUND);
      return stored !== null ? stored === "true" : true;
    }
    return true;
  };

  return {
    isSoundEnabled: getInitialSoundEnabled(),
    audioList: null,
    isMobile: false,

    initializeAudio: () => {
      if (typeof window === "undefined") return;
      
      const isMobile = window.innerWidth <= 768;
      const audioList = getAudioList(isMobile);
      
      const oldAudioList = get().audioList;
      if (oldAudioList) {
        Object.values(oldAudioList).forEach(howl => howl.unload());
      }
      
      const isSoundEnabled = get().isSoundEnabled;
      Object.values(audioList).forEach(howl => howl.mute(!isSoundEnabled));
      
      set({ audioList, isMobile });
    },

    playSound: (soundKey: AudioKey) => {
      const audioList = get().audioList;
      if (!audioList) {
        get().initializeAudio();
        const newAudioList = get().audioList;
        if (newAudioList) {
          return newAudioList[soundKey].play();
        }
        return 0;
      }
      return audioList[soundKey].play();
    },

    toggleSound: () => {
      const isSoundEnabled = !get().isSoundEnabled;
      const audioList = get().audioList;
      
      if (audioList) {
        Object.values(audioList).forEach(howl => howl.mute(!isSoundEnabled));
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_SOUND, String(isSoundEnabled));
      }
      
      set({ isSoundEnabled });
    },

    muteSound: () => {
      const audioList = get().audioList;
      if (audioList) {
        Object.values(audioList).forEach(howl => howl.mute(true));
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_SOUND, "false");
      }
      
      set({ isSoundEnabled: false });
    },

    unmuteSound: () => {
      const audioList = get().audioList;
      if (audioList) {
        Object.values(audioList).forEach(howl => howl.mute(false));
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_SOUND, "true");
      }
      
      set({ isSoundEnabled: true });
    },
  };
});

