import { BPM } from "../globals";

export const nextSubdivision = (audioCtx: AudioContext, beats: number): number => {
  const timeElapsed = audioCtx.currentTime;
  const beatsElapsed = timeElapsed / BPM.SPB;
  const subdivisionsElapsed = Math.floor(beatsElapsed / beats);
  const nextSubdivision = (subdivisionsElapsed + 1) * beats * BPM.SPB;
  return nextSubdivision;
};
