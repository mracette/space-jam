import { Instrument } from "./Instrument";
import { OrganSound } from "../../sounds/OrganSound";

export class OrganSynth extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "bs";
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
    this.sound = new OrganSound();
    this.init();
  }
}
