import { OscillatorArgs } from "./Oscillator";
import { TriangleOscillator } from "./TriangleOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class TriangleOscillator1 extends TriangleOscillator {
  constructor(args: OscillatorArgs = {}) {
    super(args);
    this.interval = DURATIONS.QUARTER_TRIPLETS;
    this.color = COLORS.HOT_PINK;
    this.width = 1;
    this.sequence = [
      [0, 1],
      [1, -1],
      [-1, -1]
    ];
    this.duration = this.interval * this.sequence.length;
    this.createRepeatingEvent();
  }
}
