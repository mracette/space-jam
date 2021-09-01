import { Instrument } from "./Instrument";
import { TinSaw } from "../sounds/harmonic-synth/TinSaw";

export class ISawSynth extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "in6";
    this.type = "bs";
    this.display = "Saw Synth";
    this.cost = 15;
    this.notes = 2;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [1, -2],
      [0, -2],
      [0, -1],
      [-1, -1],
      [-1, 0]
    ];
    this.sound = new TinSaw();
    this.init();
  }
}
