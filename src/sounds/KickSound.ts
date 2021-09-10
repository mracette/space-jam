import { Sound } from "./Sound";
import { createWaveshaperCurve } from "../utils/audio";

export class KickSound extends Sound {
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = -24;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 1 },
        { time: 0.75, value: 0.0001, exp: true }
      ]
    };
    this.effects = {
      waveshapers: [{ curve: createWaveshaperCurve(0.2) }]
    };
    this.effectOptions.baseVolume = 0.5;
  }

  play(time: number, note?: number): void {
    const sine = this.initAudioSource("waveform", note, { oscillatorType: "sine" });
    this.initEffectsChain(time, sine);
  }
}
