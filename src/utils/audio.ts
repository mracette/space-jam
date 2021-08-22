import { EnvelopeValue } from "../entities/sounds/Sound";
import { AUDIO, BASE_NOTE, DURATIONS } from "../globals/audio";

export const nextSubdivision = (duration: DURATIONS): number => {
  const durationsElapsed = AUDIO.context.currentTime / duration;
  const durationsElapsedWhole = Math.floor(durationsElapsed);
  return (durationsElapsedWhole + 1) * duration;
};

export const applyEnvelop = (
  param: AudioParam,
  startTime: number,
  envelop: EnvelopeValue[]
): void => {
  const current = param.value;
  param.linearRampToValueAtTime(current, startTime);
  envelop.forEach(({ value, time }) => {
    // The change starts at the time specified for the previous event
    param.linearRampToValueAtTime(current * value, time);
  });
};

export const intervalToHz = (interval: number): number => {
  let baseExp;
  interval > 0 ? (baseExp = 2) : (baseExp = 0.5);
  return BASE_NOTE * Math.pow(Math.pow(baseExp, 1 / 12), Math.abs(interval));
};
