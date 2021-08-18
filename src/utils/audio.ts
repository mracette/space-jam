import { DURATIONS } from "../globals";
import { AUDIO_CTX } from "../index";

export const nextSubdivision = (duration: DURATIONS): number => {
  const timeElapsed = AUDIO_CTX.currentTime;
  const durationsElapsed = timeElapsed / duration;
  const nextSubdivision = ~~durationsElapsed + duration;
  return nextSubdivision;
};
