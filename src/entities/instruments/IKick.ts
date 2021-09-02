import { Instrument } from "./Instrument";
import { Kick } from "../sounds/waveform-synth/Kick";

export class IKick extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "dr";
    this.display = "Kick";
    this.cost = 50;
    this.notes = 3;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    this.sound = new Kick({ note: 0 });
    this.init();
  }
}
