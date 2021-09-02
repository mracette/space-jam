import { Instrument } from "./Instrument";
import { TinSaw } from "../sounds/harmonic-synth/TinSaw";

export class ISawSynth extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "in6";
    this.instrumentType = "bs";
    this.display = "Saw";
    this.cost = 50;
    this.notes = 3;
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
