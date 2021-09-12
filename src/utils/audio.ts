import { F32, RAND } from "./factories";
import { clamp } from "./math";
import { Instrument } from "../entities/instruments/Instrument";
import { AUDIO, BASE_NOTE, DURATIONS, SAMPLE_RATE } from "../globals/audio";
import { CAMERA } from "../globals/game";
import { VIEWPORT_DIMENSIONS } from "../globals/sizes";
import { EnvelopeValue } from "../sounds/Sound";

export const nextSubdivision = (duration: DURATIONS): number => {
  const durationsElapsed = AUDIO.context.currentTime / duration;
  const durationsElapsedWhole = Math.floor(durationsElapsed);
  return (durationsElapsedWhole + 1) * duration;
};

export const applyEnvelop = (
  param: AudioParam,
  envelop: EnvelopeValue[],
  startTime: number = AUDIO.context.currentTime
): void => {
  if (envelop) {
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

export const updateSpatialEffects = (instrument: Instrument): void => {
  const panX = clamp(
    (instrument.position.x - CAMERA.position.x) / VIEWPORT_DIMENSIONS.W_HALF,
    -1,
    1
  );
  const panY = clamp(
    (instrument.position.y - CAMERA.position.y) / VIEWPORT_DIMENSIONS.W_HALF,
    -1,
    1
  );
  const r = Math.sqrt(panX ** 2 + panY ** 2);
  instrument.sound.pan.pan.value = panX;
  instrument.sound.setReverb(Math.abs(panX));
  instrument.sound.setVolume(clamp(1 - r, 0, 1));
};

export const createWaveshaperCurve = (amount: number, n = 256): Float32Array => {
  const k = amount * 100;
  const curve = new Float32Array(n);
  const deg = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    let x = (i * 2) / n - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
};
