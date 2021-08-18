import { OscillatorArgs } from "./Oscillator";
import { SquareOscillator } from "./SquareOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class SquareOscillator3 extends SquareOscillator {
  constructor(args: OscillatorArgs = {}) {
    super(args);
    this.interval = DURATIONS.EIGHTH;
    this.color = COLORS.HOT_BLUE;
    this.sequence = [
      [0, 3],
      [3, 3],
      [3, 0],
      [3, -3],
      [0, -3],
      [-3, -3],
      [-3, 0],
      [-3, 3]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
