import { createWaveshaperCurve } from "../../utils/audio";
import { Sound } from "../Sound";

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
      // compressors: [
      //   {
      //     threshold: -99,
      //     attack: 0,
      //     knee: 0,
      //     ratio: 20,
      //     release: 0.02
      //   }
      // ]
      waveshapers: [{ curve: createWaveshaperCurve(0.2) }]
    };
    this.effectOptions.baseVolume = 0.5;
  }

  play(time: number, note?: number): void {
    const sine = this.initAudioSource("waveform", note, { oscillatorType: "sine" });
    this.initEffectsChain(time, sine);
  }
}
