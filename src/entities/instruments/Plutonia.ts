import { Instrument } from "./Instrument";
import { PlutoniaSound } from "../../sounds/PlutoniaSound";

export class Plutonia extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "cs";
    this.display = "Plutonia";
    this.cost = 2500;
    this.notes = 25;
    this.outline = [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [2, -1],
      [2, -2],
      [1, -2],
      [0, -2],
      [0, -1]
    ];
    this.sound = new PlutoniaSound();
    this.init();
  }
}
