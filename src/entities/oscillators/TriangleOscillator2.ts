import { OscillatorArgs } from "./Oscillator";
import { TriangleOscillator } from "./TriangleOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class TriangleOscillator2 extends TriangleOscillator {
  constructor(args: OscillatorArgs = {}) {
    super(args);
    this.interval = DURATIONS.HALF_TRIPLETS;
    this.color = COLORS.HOT_GREEN;
    this.sequence = [
      [0, 2],
      [2, -2],
      [-2, -2]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
