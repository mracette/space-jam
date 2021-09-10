import { Instrument } from "./Instrument";
import { SineSound } from "../../sounds/SineSound";

export class SineSynth extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "bs";
    this.display = "Sine";
    this.cost = 75;
    this.notes = 4;
    this.outline = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0]
    ];
    this.sound = new SineSound();
    this.init();
  }
}
