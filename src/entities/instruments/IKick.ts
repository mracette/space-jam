import { Instrument } from "./Instrument";
import { Kick } from "../sounds/waveform-synth/Kick";

export class IKick extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "in1";
    this.type = "dr";
    this.display = "Kick";
    this.cost = 50;
    this.notes = 5;
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
