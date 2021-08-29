import { Instrument } from "./Instrument";
import { Snare } from "../sounds/waveform-synth/Snare";

export class ISnare extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.display = "Snare";
    this.id = "in2";
    this.cost = 25;
    this.notes = 5;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    this.init();
    this.sound = new Snare({ note: 7 });
  }
}
