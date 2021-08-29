import { AUDIO, MIXOLYDIAN_SCALE } from "../../globals/audio";
import { applyEnvelop, intervalToHz } from "../../utils/audio";

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
  // LP
  lpFrequency?: number;
  lpQ?: number;
  // LP Env
  lpEnvQ?: number;
  // HP
  hpFrequency?: number;
  hpQ?: number;
  // HP General
  hpEnvQ?: number;
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

  constructor(args: { note?: number; audioSourceOptions?: AudioSourceOptions } = {}) {
    this.note = args.note;
    this.noteAdj = 0;
    // these act as defaults
    this.effectOptions = {
      baseVolume: 1,
      baseReverb: 0,
      lpFrequency: 20000,
      hpFrequency: 20,
      lpQ: 1.7,
      lpEnvQ: 1.7,
      hpEnvQ: 1.7,
      hpQ: 1.7
    };
  }

  // eslint-disable-next-line
  play(time: number, note: number = this.getNoteToPlay()): void {
    void 0;
  }

  initEffectsChain(
    time: number,
    audioSource: AudioSourceDefinition,
    options: Partial<EffectOptions> = {}
  ): void {
    audioSource.gain.gain.value *= this.effectOptions.baseVolume;
    /**
     * Amplitude
     */
    const amplitude = AUDIO.context.createGain();
    applyEnvelop(amplitude.gain, time, this.envelopes.amplitude);

    /**
     * Reverb wet / dry
     */
    const reverbDry = AUDIO.context.createGain();
    reverbDry.gain.value = 1 - this.effectOptions.baseReverb;
    const reverbWet = AUDIO.context.createGain();
    reverbWet.gain.value = this.effectOptions.baseReverb;

    /**
     * LP Env
     */
    const lpEnv = AUDIO.context.createBiquadFilter();
    lpEnv.type = "lowpass";
    lpEnv.frequency.value = 20000;
    lpEnv.Q.value = this.getParamValue("lpEnvQ", options.lpEnvQ);

    /**
     * LP
     */
    const lp = AUDIO.context.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = this.getParamValue("lpFrequency", options.lpFrequency);
    lp.Q.value = this.getParamValue("lpQ", options.lpQ);

    /**
     * HP Env
     */
    const hpEnv = AUDIO.context.createBiquadFilter();
    hpEnv.type = "highpass";
    hpEnv.frequency.value = 20;
    hpEnv.Q.value = this.getParamValue("hpEnvQ", options.hpEnvQ);

    /**
     * HP
     */
    const hp = AUDIO.context.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = this.getParamValue("hpFrequency", options.hpFrequency);
    hp.Q.value = this.getParamValue("hpQ", options.hpQ);

    /**
     * Apply envelopes
     */
    this.envelopes?.lpFilter &&
      applyEnvelop(lpEnv.frequency, time, this.envelopes.lpFilter);
    this.envelopes?.hpFilter &&
      applyEnvelop(hpEnv.frequency, time, this.envelopes.hpFilter);

    /**
     * Create chain
     */
    const { source, gain } = audioSource;
    source.connect(gain);
    gain.connect(amplitude);
    amplitude.connect(lpEnv);
    lpEnv.connect(hpEnv);
    hpEnv.connect(lp);
    lp.connect(hp);
    hp.connect(reverbWet);
    hp.connect(reverbDry);
    reverbDry.connect(AUDIO.premaster);
    reverbWet.connect(AUDIO.reverb);
    source.start(time);
    source.stop(time + this.duration);
    source.onended = () => {
      // triggers GC
      source.disconnect();
      amplitude.disconnect();
    };
  }

  initAudioSource(
    sourceType: "harmonics" | "waveform" | "sample",
    time: number,
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
      if (!harmonic) throw new Error("harmonic option required");
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
    if (typeof value !== "undefined") {
      return value;
    }
    return this.effectOptions[name];
  }

  getNoteToPlay(note?: number): number {
    if (typeof note !== "undefined") {
      return this.noteAdj + note;
    }
    if (typeof this.note !== "undefined") {
      {
        return this.noteAdj + this.note;
      }
    }
    return (
      this.noteAdj + MIXOLYDIAN_SCALE[Math.floor(Math.random() * MIXOLYDIAN_SCALE.length)]
    );
  }
}
