import { DURATIONS } from "../globals";
import { AUDIO_CTX } from "../index";

export const nextSubdivision = (duration: DURATIONS): number => {
  const durationsElapsed = AUDIO_CTX.currentTime / duration;
  const durationsElapsedWhole = Math.floor(durationsElapsed);
  return (durationsElapsedWhole + 1) * duration;
};
