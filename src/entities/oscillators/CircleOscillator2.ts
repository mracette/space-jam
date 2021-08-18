import { CircleOscillator, CircleOscillatorArgs } from "./CircleOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class CircleOscillator2 extends CircleOscillator {
  constructor(args: CircleOscillatorArgs) {
    super(args);
    this.interval = DURATIONS.HALF;
    this.color = COLORS.HOT_GREEN;
    this.sequence = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
