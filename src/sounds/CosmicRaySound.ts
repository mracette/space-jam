import { Sound } from "./Sound";
import { AUDIO, DURATIONS, MIXOLYDIAN_SCALE } from "../globals/audio";

export class CosmicRaySound extends Sound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0] = {}) {
    super(args);
    this.noteAdj = 36;
    this.envelopes = {
      amplitude: [
        { time: 0, value: 1 },
        { time: 0.2, value: 0 }
      ]
      // lpFilter: [
      //   { time: 0, value: 0 },
      //   { time: 0.25, value: 3500 },
      //   { time: 1.75, value: 0.0001, exp: true }
      // ]
    };
    this.effectOptions.baseReverb = 0.25;
    this.effectOptions.baseVolume = 0.09;
    this.effects = {
      filters: [
        {
          type: "lowpass",
          frequency: 1500,
          q: 0.71
        },
        { type: "highpass", frequency: 250, q: 1.2 }
      ]
    };
    // this.effectOptions.lpFrequency = 1500;
    // this.effectOptions.hpFrequency = 1000;
  }
  play(): void {
    const notes = [
      this.initAudioSource("waveform", MIXOLYDIAN_SCALE[0], { oscillatorType: "sine" }),
      this.initAudioSource("waveform", MIXOLYDIAN_SCALE[1], { oscillatorType: "sine" }),
      this.initAudioSource("waveform", MIXOLYDIAN_SCALE[3], { oscillatorType: "sine" }),
      this.initAudioSource("waveform", MIXOLYDIAN_SCALE[4], { oscillatorType: "sine" })
    ];
    notes.forEach((note, i) => {
      window.setTimeout(() => {
        this.initEffectsChain(AUDIO.context.currentTime, note);
      }, i * DURATIONS.THIRTY_SECONDTH * 1000);
    });
  }
}
