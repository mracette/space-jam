import { Sound } from "./Sound";
import { SynthSound } from "./SynthSound";

export class PlutoniaSound extends SynthSound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = -12;
    this.harmonics = [0, 2, 4];
    this.harmonicsSquare = [1];
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.1, value: 1 },
        { time: 0.5, value: 0.7 },
        { time: 0.95, value: 0.0001, exp: false }
      ],
      lpFilter: [
        { time: 0, value: 0 },
        { time: 0.25, value: 3500 },
        { time: 1.75, value: 0.0001, exp: true }
      ]
    };
    this.effectOptions.baseReverb = 0.5;
    this.effectOptions.baseVolume = 0.4;
    this.effects = {
      filters: [
        {
          type: "lowpass",
          frequency: 1500,
          q: 0.71
        },
        { type: "highpass", frequency: 150, q: 1.2 }
      ]
    };
    // this.effectOptions.lpFrequency = 1500;
    // this.effectOptions.hpFrequency = 1000;
  }
}
