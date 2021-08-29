import { AUDIO } from "../../../globals/audio";
import { Sound } from "../Sound";

export class Tom extends Sound {
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
    const sine = this.initAudioSource("waveform", time, note, { oscillatorType: "sine" });
    this.initEffectsChain(time, sine);
  }
}
