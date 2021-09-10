import { Sound } from "./Sound";
import { SynthSound } from "./SynthSound";

export class SquareSound extends SynthSound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.harmonics = [2, 4, 6];
    this.harmonicsSquare = [1];
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.01, value: 1 },
        { time: 0.15, value: 0 }
      ],
      lpFilter: [{ time: 0.35, value: 0.001, exp: true }]
    };
    this.effectOptions.baseReverb = 0.2;
    this.effects = {
      filters: [
        {
          type: "lowpass",
          frequency: 1500,
          q: 0.71
        },
        {
          type: "highpass",
          frequency: 120,
          q: 0.71
        }
      ]
    };
    // this.effectOptions.lpFrequency = 1500;
    // this.effectOptions.hpFrequency = 1000;
  }
}
