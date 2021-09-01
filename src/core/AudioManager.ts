import { REVERB_TIME, SAMPLE_RATE } from "../globals/audio";
import { createFilter, generateNoise } from "../utils/audio";

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
  premaster: GainNode;
  reverb: ConvolverNode;
  static baseNote = 196;
  static reverbTime = 2;
  static sr = 44100;
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: SAMPLE_RATE.VALUE
    });
    this.offline = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
      2,
      SAMPLE_RATE.VALUE * REVERB_TIME.VALUE,
      SAMPLE_RATE.VALUE
    );
    this.premaster = this.context.createGain();
    this.premaster.connect(this.context.destination);
    this.reverb = this.context.createConvolver();
    this.reverb.connect(this.premaster);
  }

  async init(): Promise<void> {
    const reverbBuffer = await this.renderReverbTail();
    this.reverb.buffer = reverbBuffer;
    this.reverb.connect(this.premaster);
  }

  async renderReverbTail(): Promise<AudioBuffer> {
    return new Promise((resolve) => {
      const envelope = this.offline.createGain();
      envelope.connect(this.offline.destination);
      envelope.gain.setValueAtTime(1, 0);
      envelope.gain.exponentialRampToValueAtTime(0.0001, REVERB_TIME.VALUE);

      const tailLPFilter = createFilter(this.offline, "lowpass", 5000, envelope);
      const tailHPFilter = createFilter(this.offline, "highpass", 500, tailLPFilter);

      const noiseSource = this.offline.createBufferSource();
      noiseSource.buffer = generateNoise(REVERB_TIME.VALUE);
      noiseSource.connect(tailHPFilter);
      noiseSource.start();
      this.offline.startRendering();

      this.offline.oncomplete = (buffer) => {
        resolve(buffer.renderedBuffer);
      };
    });
  }
}
