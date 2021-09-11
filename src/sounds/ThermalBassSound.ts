import { Sound } from "./Sound";
import { createWaveshaperCurve } from "../utils/audio";

export class ThermalBassSound extends Sound {
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = -24;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.1, value: 1 },
        { time: 0.5, value: 0.7 },
        { time: 0.95, value: 0.0001, exp: false }
      ]
    };
    this.effects = {
      filters: [
        { type: "lowpass", frequency: 2500, q: 1 },
        { type: "highpass", frequency: 90 }
      ],
      waveshapers: [{ curve: createWaveshaperCurve(0.5) }]
    };
    this.effectOptions.baseVolume = 0.2;
  }

  play(time: number, note?: number): void {
    const sine = this.initAudioSource("waveform", note, { oscillatorType: "sine" });
    this.initEffectsChain(time, sine);
  }
}
