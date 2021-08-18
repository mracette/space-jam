import { OscillatorArgs } from "./Oscillator";
import { SquareOscillator } from "./SquareOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class SquareOscillator2 extends SquareOscillator {
  constructor(args: OscillatorArgs = {}) {
    super(args);
    this.interval = DURATIONS.EIGHTH;
    this.color = COLORS.HOT_GREEN;
    this.sequence = [
      [0, 2],
      [2, 2],
      [2, 0],
      [2, -2],
      [0, -2],
      [-2, -2],
      [-2, 0],
      [-2, 2]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
