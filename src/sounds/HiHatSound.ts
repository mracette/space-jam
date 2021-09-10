import { Sound } from "./Sound";
import { AUDIO } from "../globals/audio";

export class HiHatSound extends Sound {
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = 0;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.01, value: 1 },
        { time: 0.25, value: 0.0001, exp: true }
      ]
    };
    this.effects = {
      filters: [
        { type: "highpass", frequency: 350, q: 1.7 },
        {
          type: "peaking",
          gain: -12,
          frequency: 8780,
          q: 0.85
        },
        { type: "lowpass", frequency: 18000, q: 0.59 }
      ]
    };
    this.effectOptions.baseVolume = 0.1;
  }

  play(time: number, note?: number): void {
    const noise = this.initAudioSource("sample", note, {
      buffer: AUDIO.reverb.buffer
    });
    noise.source.detune.value = 2400;
    this.initEffectsChain(time, noise);
  }
}
