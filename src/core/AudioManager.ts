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
  public instruments: any[];
  public context: AudioContext;
  public offline: OfflineAudioContext;
  public premaster: GainNode;
  public reverb: ConvolverNode;
  public compressor: DynamicsCompressorNode;
  public analyser: AnalyserNode;
  public frequencyData: Uint8Array;
  static baseNote = 196;
  static reverbTime = 2;
  static sr = 44100;
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: SAMPLE_RATE.VALUE
    });
    this.context.suspend();
    this.offline = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
      2,
      SAMPLE_RATE.VALUE * REVERB_TIME.VALUE,
      SAMPLE_RATE.VALUE
    );
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2 ** 6;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 24;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0;
    this.compressor.release.value = 0.25;
    this.premaster = this.context.createGain();
    this.premaster.connect(this.analyser);
    this.analyser.connect(this.context.destination);
    // this.premaster.connect(this.compressor);
    // this.compressor.connect(this.context.destination);
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
