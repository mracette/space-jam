import { Instrument } from "./Instrument";
import { SquareSound } from "../../sounds/SquareSound";

export class SquareSynth extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "bs";
    this.display = "Square";
    this.cost = 100;
    this.notes = 5;
    this.outline = [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, -1],
      [1, -1],
      [1, -2],
      [0, -2],
      [0, -1]
    ];
    this.sound = new SquareSound();
    this.init();
  }
}
