import { Instrument } from "./Instrument";
import { Kick } from "../sounds/waveform-synth/Kick";

export class IKick extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.display = "Kick";
    this.id = "in1";
    this.cost = 5;
    this.notes = 1;
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
