import { Sound } from "./Sound";
import { SynthSound } from "./SynthSound";

export class HarmonixSound extends SynthSound {
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.harmonicsSaw = [0, 2, 4];
    this.noteAdj = -24;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.5, value: 1 },
        { time: 0.75, value: 0 }
      ]
    };
    this.effectOptions.baseReverb = 0.2;
    this.effectOptions.baseVolume = 0.4;
  }
}
