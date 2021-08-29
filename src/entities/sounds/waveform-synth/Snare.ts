import { AUDIO } from "../../../globals/audio";
import { Sound } from "../Sound";

export class Snare extends Sound {
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = 0;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 1 },
        { time: 0.45, value: 0.0001, exp: true }
      ]
    };
    this.effectOptions.hpFrequency = 90;
    this.effectOptions.baseReverb = 0.05;
    this.effectOptions.baseVolume = 0.4;
  }

  play(time: number, note: number = this.getNoteToPlay()): void {
    const sine = this.initAudioSource("waveform", time, note, { oscillatorType: "sine" });
    sine.gain.gain.value = 0.4;
    const noise = this.initAudioSource("sample", time, note, {
      buffer: AUDIO.reverb.buffer
    });
    noise.source.detune.value = note * 100;
    this.initEffectsChain(time, sine);
    this.initEffectsChain(time, noise);
  }
}
