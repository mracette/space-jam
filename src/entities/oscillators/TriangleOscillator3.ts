import { OscillatorArgs } from "./Oscillator";
import { TriangleOscillator } from "./TriangleOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class TriangleOscillator3 extends TriangleOscillator {
  constructor(args: OscillatorArgs = {}) {
    super(args);
    this.interval = DURATIONS.WHOLE_TRIPLETS;
    this.color = COLORS.HOT_BLUE;
    this.sequence = [
      [0, 3],
      [3, -3],
      [-3, -3]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
