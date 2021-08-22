export type InstrumentId = "test1" | "test2" | "test3" | "test4";

export interface InstrumentDefinition {
  harmonics: number[];
  oscillators?: OscillatorNode[];
  gainNodes?: GainNode[];
}

interface EnvelopeValue {
  time: number;
  value: number;
}

export interface Envelope {
  a?: EnvelopeValue;
  s?: EnvelopeValue;
  d?: EnvelopeValue;
  r?: EnvelopeValue;
}

export class AudioManager {
  instruments: any[];
  context: AudioContext;
  offline: OfflineAudioContext;
  static baseNote = 196;
  static reverbTime = 2;
  static sr = 44100;
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.offline = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
      2,
      AudioManager.sr * AudioManager.reverbTime,
      AudioManager.sr
    );
  }
}
