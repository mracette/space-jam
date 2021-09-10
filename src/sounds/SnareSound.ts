import { Sound } from "./Sound";
import { AUDIO } from "../globals/audio";

export class SnareSound extends Sound {
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = 0;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 0 },
        { time: 0.015, value: 1 },
        { time: 0.45, value: 0.0001, exp: true }
      ]
    };
    this.effects = { filters: [{ type: "highpass", frequency: 90, q: 1.7 }] };
    this.effectOptions.baseReverb = 0.05;
    this.effectOptions.baseVolume = 0.25;
  }

  play(time: number, note: number = this.getNoteToPlay()): void {
    const sine = this.initAudioSource("waveform", note, { oscillatorType: "sine" });
    sine.gain.gain.value = 0.3;
    const noise = this.initAudioSource("sample", note, {
      buffer: AUDIO.reverb.buffer
    });
    noise.gain.gain.value = 0.5;
    // noise.source.detune.value = note * 100;
    this.initEffectsChain(time, sine);
    this.initEffectsChain(time, noise);
  }
}
