import { Sound } from "./Sound";

export class SynthSound extends Sound {
  harmonics?: number[];
  harmonicsSquare?: number[];
  harmonicsSaw?: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0]) {
    super(args);
  }

  play(time: number, note?: number): void {
    this.harmonics?.forEach((harmonic) => {
      const source = this.initAudioSource("harmonics", note, {
        oscillatorType: "sine",
        harmonic
      });
      this.initEffectsChain(time, source);
    });
    this.harmonicsSquare?.forEach((harmonic) => {
      const source = this.initAudioSource("harmonics", note, {
        oscillatorType: "square",
        harmonic
      });
      this.initEffectsChain(time, source);
    });
    this.harmonicsSaw?.forEach((harmonic) => {
      const source = this.initAudioSource("harmonics", note, {
        oscillatorType: "sawtooth",
        harmonic
      });
      this.initEffectsChain(time, source);
    });
  }
}
