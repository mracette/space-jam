import { AUDIO, MIXOLYDIAN_SCALE } from "../globals/audio";
import { applyEnvelop, intervalToHz } from "../utils/audio";
import { isUndefined } from "../utils/conversions";
import { clamp } from "../utils/math";

export interface FilterParams {
  q?: BiquadFilterNode["Q"]["value"];
  type: BiquadFilterNode["type"];
  frequency?: BiquadFilterNode["frequency"]["value"];
  gain?: BiquadFilterNode["gain"]["value"];
}

export interface CompressorParams {
  threshold?: DynamicsCompressorNode["threshold"]["value"];
  knee?: DynamicsCompressorNode["knee"]["value"];
  ratio?: DynamicsCompressorNode["ratio"]["value"];
  attack?: DynamicsCompressorNode["attack"]["value"];
  release?: DynamicsCompressorNode["release"]["value"];
}

export interface WaveshaperParams {
  curve: Float32Array;
}

export interface EnvelopeValue {
  time: number;
  value: number;
  exp?: boolean;
}

export interface Envelopes {
  lpFilter?: EnvelopeValue[];
  hpFilter?: EnvelopeValue[];
  amplitude?: EnvelopeValue[];
}

interface AudioSourceDefinition {
  source: OscillatorNode | AudioBufferSourceNode;
  gain: GainNode;
  note: number;
}

export interface EffectOptions {
  baseVolume: number;
  baseReverb: number;
  lpEnvQ?: number;
  hpEnvQ?: number;
  pan?: number;
}

export interface AudioSourceOptions {
  harmonic?: number;
  oscillatorType?: OscillatorType;
  buffer?: AudioBuffer;
}

export class Sound {
  note?: number;
  duration: number;
  effectOptions: EffectOptions;
  envelopes: Envelopes;
  noteAdj: number;
  pan: StereoPannerNode;
  reverbDry: GainNode;
  reverbWet: GainNode;
  finalGain: GainNode;
  currentReverb: number;
  currentVolume: number;
  effects: {
    filters?: FilterParams[];
    compressors?: CompressorParams[];
    waveshapers?: WaveshaperParams[];
  };

  constructor(args: { note?: number; audioSourceOptions?: AudioSourceOptions } = {}) {
    this.note = args.note;
    this.noteAdj = 0;
    this.pan = AUDIO.context.createStereoPanner();
    this.reverbDry = AUDIO.context.createGain();
    this.reverbWet = AUDIO.context.createGain();
    this.finalGain = AUDIO.context.createGain();
    this.currentReverb = 0;
    // these act as defaults
    this.effectOptions = {
      baseVolume: 0.5,
      baseReverb: 0,
      lpEnvQ: 1.7,
      hpEnvQ: 1.7
    };
  }

  // eslint-disable-next-line
  play(time: number, note: number = this.getNoteToPlay()): void {
    void 0;
  }

  hasOptionalEffects(): boolean {
    if (!this.effects) return false;
    let hasEffects = false;
    for (let effectParams in Object.values(this.effects)) {
      if (effectParams.length > 0) hasEffects = true;
      break;
    }
    return hasEffects;
  }

  initOptionalEffects(): (BiquadFilterNode | DynamicsCompressorNode | WaveShaperNode)[] {
    const filters = (this.effects?.filters || []).map(({ q, type, frequency, gain }) => {
      const filter = AUDIO.context.createBiquadFilter();
      filter.type = type;
      q && (filter.Q.value = q);
      frequency && (filter.frequency.value = frequency);
      gain && (filter.gain.value = gain);
      return filter;
    });
    const compressors = (this.effects?.compressors || []).map(
      ({ threshold, attack, knee, ratio, release }) => {
        const compressor = AUDIO.context.createDynamicsCompressor();
        compressor.threshold.value = threshold;
        compressor.attack.value = attack;
        compressor.knee.value = knee;
        compressor.ratio.value = ratio;
        compressor.release.value = release;
        return compressor;
      }
    );
    const waveshapers = (this.effects?.waveshapers || []).map((effect) => {
      const waveshaper = AUDIO.context.createWaveShaper();
      waveshaper.curve = effect.curve;
      return waveshaper;
    });
    const allEffects = [...waveshapers, ...filters, ...compressors];
    allEffects.forEach((effect, i, arr) => {
      if (i !== arr.length - 1) {
        effect.connect(arr[i + 1]);
      }
    });
    return allEffects;
  }

  setReverb(amount?: number): void {
    if (!isUndefined(amount)) {
      this.currentReverb = amount;
    }
    this.reverbDry.gain.value = 1 - this.currentReverb - this.effectOptions.baseReverb;
    this.reverbWet.gain.value = this.effectOptions.baseReverb + this.currentReverb;
  }

  setVolume(amount?: number): void {
    if (!isUndefined(amount)) {
      this.currentVolume = amount;
    }
    this.finalGain.gain.value = clamp(
      this.effectOptions.baseVolume * this.currentVolume,
      0,
      1
    );
  }

  initEffectsChain(
    time: number,
    audioSource: AudioSourceDefinition,
    options: Partial<EffectOptions> = {}
  ): void {
    /**
     * Amplitude
     */
    const amplitude = AUDIO.context.createGain();
    applyEnvelop(amplitude.gain, this.envelopes.amplitude);

    /**
     * Reverb wet / dry
     */
    this.setReverb();

    /**
     * LP Env
     */
    const lpEnv = AUDIO.context.createBiquadFilter();
    lpEnv.type = "lowpass";
    lpEnv.frequency.value = 20000;
    lpEnv.Q.value = this.getParamValue("lpEnvQ", options.lpEnvQ);

    /**
     * HP Env
     */
    const hpEnv = AUDIO.context.createBiquadFilter();
    hpEnv.type = "highpass";
    hpEnv.frequency.value = 20;
    hpEnv.Q.value = this.getParamValue("hpEnvQ", options.hpEnvQ);

    /**
     * Final gain node
     */
    this.setVolume();

    /**
     * Apply envelopes
     */
    this.envelopes?.lpFilter && applyEnvelop(lpEnv.frequency, this.envelopes.lpFilter);
    this.envelopes?.hpFilter && applyEnvelop(hpEnv.frequency, this.envelopes.hpFilter);

    /**
     * Create chain
     */
    const { source, gain } = audioSource;
    source.connect(gain);
    gain.connect(amplitude);
    amplitude.connect(lpEnv);
    lpEnv.connect(hpEnv);

    /**
     * Connect optional effects mid-chain
     */
    if (this.hasOptionalEffects()) {
      const effects = this.initOptionalEffects();
      const first = effects[0];
      const last = effects.pop();
      // first.disconnect();
      hpEnv.connect(first);
      // last.disconnect();
      last.connect(this.finalGain);
    } else {
      lpEnv.connect(this.finalGain);
    }

    this.finalGain.connect(this.pan);
    this.pan.connect(this.reverbDry);
    this.pan.connect(this.reverbWet);
    this.reverbDry.connect(AUDIO.premaster);
    this.reverbWet.connect(AUDIO.reverb);

    source.start(time);
    source.stop(time + this.duration);
    source.onended = () => {
      // triggers GC ?
      source.disconnect();
    };
  }

  initAudioSource(
    sourceType: "harmonics" | "waveform" | "sample",
    note: number,
    options: AudioSourceOptions = {}
  ): AudioSourceDefinition {
    let source;
    const gain = AUDIO.context.createGain();
    const noteToPlay = this.getNoteToPlay(note);

    if (sourceType === "waveform") {
      const { oscillatorType } = options;
      source = AUDIO.context.createOscillator();
      source.type = oscillatorType;
      source.frequency.value = intervalToHz(noteToPlay);
    }

    if (sourceType === "harmonics") {
      const { harmonic, oscillatorType } = options;
      source = AUDIO.context.createOscillator();
      source.type = oscillatorType;
      if (isUndefined(harmonic)) throw new Error("harmonic option required");
      // compensate gain for frequency
      gain.gain.value = 0.2 / (1 + Math.log2(harmonic));
      source.frequency.value = intervalToHz(noteToPlay) * harmonic;
    }

    if (sourceType === "waveform" || sourceType === "harmonics") {
      this.duration =
        this.envelopes.amplitude?.map(({ time }) => time).reduce((a, b) => a + b) || 0;
    }

    if (sourceType === "sample") {
      const { buffer } = options;
      source = AUDIO.context.createBufferSource();
      source.buffer = buffer;
      this.duration = buffer.duration;
    }

    return { source, gain, note };
  }

  getParamValue<T extends keyof EffectOptions>(
    name: T,
    value?: EffectOptions[T]
  ): EffectOptions[T] {
    if (!isUndefined(value)) {
      return value;
    }
    return this.effectOptions[name];
  }

  getNoteToPlay(note?: number): number {
    if (!isUndefined(note)) {
      return this.noteAdj + note;
    }
    if (!isUndefined(this.note)) {
      {
        return this.noteAdj + this.note;
      }
    }
    return (
      this.noteAdj + MIXOLYDIAN_SCALE[Math.floor(Math.random() * MIXOLYDIAN_SCALE.length)]
    );
  }
}
