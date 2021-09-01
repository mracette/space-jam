import { Instrument } from "./Instrument";
import { Snare } from "../sounds/waveform-synth/Snare";

export class ISnare extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "in2";
    this.type = "dr";
    this.display = "Snare";
    this.cost = 25;
    this.notes = 3;
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
