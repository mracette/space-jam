import { Sound } from "./Sound";

export class TomSound extends Sound {
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = 0;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 1 },
        { time: 0.25, value: 0.0001, exp: true }
      ]
    };
    this.effectOptions.baseReverb = 0.05;
  }

  play(time: number, note?: number): void {
    const sine = this.initAudioSource("waveform", note, { oscillatorType: "sine" });
    sine.gain.gain.value = 0.5;
    this.initEffectsChain(time, sine);
  }
}
