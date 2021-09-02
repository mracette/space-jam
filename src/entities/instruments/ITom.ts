import { Instrument } from "./Instrument";
import { Tom } from "../sounds/waveform-synth/Tom";

export class ITom extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "dr";
    this.display = "Tom";
    this.cost = 15;
    this.notes = 3;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    this.sound = new Tom({ note: 0 });
    this.init();
  }
}
