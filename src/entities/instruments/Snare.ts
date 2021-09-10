import { Instrument } from "./Instrument";
import { SnareSound } from "../../sounds/SnareSound";

export class Snare extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "dr";
    this.display = "Snare";
    this.cost = 25;
    this.notes = 2;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    this.sound = new SnareSound({ note: 0 });
    this.init();
  }
}
