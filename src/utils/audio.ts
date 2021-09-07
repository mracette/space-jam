import { F32, RAND } from "./factories";
import { Instrument } from "../entities/instruments/Instrument";
import { AUDIO, BASE_NOTE, DURATIONS, SAMPLE_RATE } from "../globals/audio";
import { CAMERA } from "../globals/game";
import { EnvelopeValue } from "../sounds/Sound";

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
  if (envelop) {
    const current = param.value;
    param.linearRampToValueAtTime(current, startTime);
    envelop.forEach(({ value, time, exp = false }) => {
      if (exp) {
        param.exponentialRampToValueAtTime(value, startTime + time);
      } else {
        param.linearRampToValueAtTime(value, startTime + time);
      }
    });
  }
};

export const intervalToHz = (interval: number): number => {
  let baseExp;
  interval > 0 ? (baseExp = 2) : (baseExp = 0.5);
  return BASE_NOTE * Math.pow(Math.pow(baseExp, 1 / 12), Math.abs(interval));
};

export const createFilter = (
  audioCtx: AudioContext | OfflineAudioContext = AUDIO.context,
  type: BiquadFilterType,
  frequency: number,
  destination: AudioNode
): BiquadFilterNode => {
  const node = audioCtx.createBiquadFilter();
  node.frequency.value = frequency;
  node.type = type;
  destination && node.connect(destination);
  return node;
};

export const generateNoise = (time: number): AudioBuffer => {
  const samples = time * SAMPLE_RATE.VALUE;
  const lBuffer = F32(samples);
  const rBuffer = F32(samples);
  for (let i = 0; i < samples; i++) {
    lBuffer[i] = 1 - 2 * RAND();
    rBuffer[i] = 1 - 2 * RAND();
  }
  const buffer = AUDIO.context.createBuffer(2, samples, SAMPLE_RATE.VALUE);
  buffer.getChannelData(0).set(lBuffer);
  buffer.getChannelData(1).set(rBuffer);
  return buffer;
};

export const setPannerPosition = (instrument: Instrument): void => {
  instrument.sound.pan.positionX.value = instrument.position.x - CAMERA.position.x;
  instrument.sound.pan.positionY.value = instrument.position.y - CAMERA.position.y;
};

export interface FilterParams {
  q?: number;
  type: BiquadFilterNode["type"];
  frequency?: number;
  gain?: number;
}

export const createFilterChain = (filterParams: FilterParams[]): BiquadFilterNode[] => {
  const filters = filterParams.map(({ q, type, frequency, gain }) => {
    const filter = AUDIO.context.createBiquadFilter();
    filter.type = type;
    q && (filter.Q.value = q);
    frequency && (filter.frequency.value = frequency);
    gain && (filter.gain.value = gain);
    return filter;
  });
  filters.forEach((filter, i, arr) => {
    if (i !== arr.length - 1) {
      filter.connect(arr[i + 1]);
    }
  });
  return filters;
};
