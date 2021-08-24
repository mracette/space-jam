import { AUDIO } from "../../../globals/audio";
import { applyEnvelop, intervalToHz } from "../../../utils/audio";
import { Sound } from "../Sound";

export class SynthSound extends Sound {
  harmonics?: number[];
  harmonicsSquare?: number[];
  harmonicsSaw?: number[];
  duration: number;
  constructor(args: ConstructorParameters<typeof Sound>[0]) {
    super(args);
  }

  init(): void {
    this.duration = this.envelop.map(({ time }) => time).reduce((a, b) => a + b);
  }

  initOscillator(
    harmonic: number,
    time: number,
    note: number,
    type: OscillatorType
  ): void {
    const o = AUDIO.context.createOscillator();
    o.type = type;
    const g = AUDIO.context.createGain();
    const dry = AUDIO.context.createGain();
    dry.gain.value = 1 - this.baseReverb;
    const wet = AUDIO.context.createGain();
    wet.gain.value = this.baseReverb;
    const lp = AUDIO.context.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5000;
    lp.Q.value = 2.7;
    g.gain.value = 0.2 / (1 + Math.log2(harmonic));
    o.frequency.value = intervalToHz(note) * harmonic;
    applyEnvelop(g.gain, time, this.envelop);
    applyEnvelop(lp.frequency, time, this.lpFilterEnvelope);
    o.connect(g);
    g.connect(lp);
    lp.connect(wet);
    lp.connect(dry);
    dry.connect(AUDIO.premaster);
    wet.connect(AUDIO.reverb);
    o.start(time);
    o.stop(time + this.duration);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }

  play(time: number, note: number): void {
    this.harmonics?.forEach((harmonic) => {
      this.initOscillator(harmonic, time, note, "sine");
    });
    this.harmonicsSquare?.forEach((harmonic) => {
      this.initOscillator(harmonic, time, note, "square");
    });
    this.harmonicsSaw?.forEach((harmonic) => {
      this.initOscillator(harmonic, time, note, "sawtooth");
    });
  }
}
