import { AUDIO } from "../../../globals/audio";
import { applyEnvelop, intervalToHz } from "../../../utils/audio";
import { Sound } from "../Sound";

export class SynthSound extends Sound {
  harmonics: number[];
  constructor(args: ConstructorParameters<typeof Sound>[0]) {
    super(args);
  }

  play(time: number, note: number): void {
    this.harmonics.forEach((harmonic) => {
      const o = AUDIO.context.createOscillator();
      const g = AUDIO.context.createGain();
      g.gain.value = 0.2 / (1 + Math.log2(harmonic));
      o.frequency.value = intervalToHz(note) * harmonic;
      o.connect(g);
      g.connect(AUDIO.context.destination);
      applyEnvelop(g.gain, time, this.envelop);
      o.start(time);
    });
  }
}
