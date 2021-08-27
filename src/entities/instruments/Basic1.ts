import { Instrument } from "./Instrument";
import { MIXOLYDIAN_SCALE } from "../../globals/audio";
import { Organ } from "../sounds/harmonic-synth/Organ";
import { TinSquare } from "../sounds/harmonic-synth/TinSquare";

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
    this.sound = new TinSquare({ note: MIXOLYDIAN_SCALE[0] });
    this.init();
  }
}
