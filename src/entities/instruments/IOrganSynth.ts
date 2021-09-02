import { Instrument } from "./Instrument";
import { Organ } from "../sounds/harmonic-synth/Organ";

export class IOrganSynth extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "in5";
    this.type = "bs";
    this.display = "Organ";
    this.cost = 25;
    this.notes = 2;
    this.outline = [
      [0, 1],
      [0, 0],
      [0, -1],
      [1, -1],
      [2, -1],
      [2, 0],
      [1, 0],
      [1, 1]
    ];
    this.sound = new Organ();
    this.init();
  }
}
