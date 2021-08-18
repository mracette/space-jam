import { OscillatorArgs } from "./Oscillator";
import { SquareOscillator } from "./SquareOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class SquareOscillator1 extends SquareOscillator {
  constructor(args: OscillatorArgs = {}) {
    super(args);
    this.interval = DURATIONS.SIXTEENTH;
    this.color = COLORS.HOT_PINK;
    this.sequence = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
