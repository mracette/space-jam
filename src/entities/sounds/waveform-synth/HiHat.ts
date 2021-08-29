import { AUDIO } from "../../../globals/audio";
import { Sound } from "../Sound";

export class HiHat extends Sound {
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
    const noise = this.initAudioSource("sample", time, note, {
      buffer: AUDIO.reverb.buffer
    });
    noise.gain.gain.value = 0.4;
    noise.source.detune.value = 2400;
    this.initEffectsChain(time, noise);
  }
}
