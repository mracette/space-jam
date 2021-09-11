import { Instrument } from "./Instrument";
import { HarmonixSound } from "../../sounds/HarmonixSound";

export class Harmonix extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "cs";
    this.display = "Harmonix";
    this.cost = 500;
    this.notes = 15;
    this.outline = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 0],
      [3, 0],
      [3, -1],
      [2, -1],
      [1, -1],
      [1, -2],
      [0, -2],
      [0, -1],
      [-1, -1],
      [-2, -1],
      [-2, 0],
      [-1, 0]
    ];
    this.sound = new HarmonixSound();
    this.init();
  }
}
