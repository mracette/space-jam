import { SynthSound } from "./SynthSound";
import { Sound } from "../Sound";

export class TinSine extends SynthSound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.harmonics = [1, 8, 9, 12, 15];
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.01, value: 1 },
        { time: 0.35, value: 0 }
      ],
      lpFilter: [{ time: 0.35, value: 0.001, exp: true }]
    };
    this.effectOptions.baseReverb = 0.2;
  }
}
