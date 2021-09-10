import { Sound } from "./Sound";
import { SynthSound } from "./SynthSound";

export class SawSound extends SynthSound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.harmonicsSaw = [1];
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.01, value: 1 },
        { time: 0.7, value: 0 }
      ],
      // lpFilter: [{ time: 0.35, value: 0.001, exp: true }],
      lpFilter: [
        { time: 0, value: 0, exp: false },
        { time: 0.15, value: 5000, exp: false }
      ]
    };
    this.effectOptions.baseReverb = 0.4;
    this.effects = {
      filters: [
        {
          type: "lowpass",
          frequency: 1500,
          q: 1
        },
        {
          type: "highpass",
          frequency: 120,
          q: 0.71
        }
      ]
    };
  }
}
