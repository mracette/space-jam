import { Sound } from "../Sound";

export class Eight0Eight extends Sound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = -24;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 1 },
        { time: 0.75, value: 0.0001, exp: true }
      ]
    };
  }

  play(time: number, note?: number): void {
    const sine = this.initAudioSource("waveform", time, note, { oscillatorType: "sine" });
    this.initEffectsChain(time, sine);
  }
}
