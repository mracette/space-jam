import { Instrument } from "./Instrument";
import { Organ } from "../sounds/synth-sounds/Organ";

export class Basic1 extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "t11";
    this.cost = 5;
    this.notes = 1;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    this.sound = new Organ();
    this.init();
  }
}
