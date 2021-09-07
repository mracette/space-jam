import { SynthSound } from "./SynthSound";
import { Sound } from "../Sound";

export class ComplexSawSound extends SynthSound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.harmonicsSaw = [1, 3, 5];
    this.noteAdj = -24;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.5, value: 1 },
        { time: 0.75, value: 0 }
      ]
      // lpFilter: [{ time: 0.35, value: 0.001, exp: true }]
    };
    this.effectOptions.baseReverb = 0.2;
  }
}
