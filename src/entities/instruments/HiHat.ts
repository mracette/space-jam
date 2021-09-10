import { Instrument } from "./Instrument";
import { HiHatSound } from "../../sounds/HiHatSound";

export class HiHat extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "dr";
    this.display = "HiHat";
    this.cost = 5;
    this.notes = 1;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    this.sound = new HiHatSound({ note: 0 });
    this.init();
  }
}
