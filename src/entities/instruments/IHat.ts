import { Instrument } from "./Instrument";
import { HiHat } from "../sounds/waveform-synth/HiHat";

export class IHat extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.display = "HiHat";
    this.id = "in3";
    this.cost = 5;
    this.notes = 1;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    this.sound = new HiHat({ note: 0 });
    this.init();
  }
}
