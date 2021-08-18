import { CircleOscillator, CircleOscillatorArgs } from "./CircleOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class CircleOscillator3 extends CircleOscillator {
  constructor(args: CircleOscillatorArgs) {
    super(args);
    this.interval = DURATIONS.WHOLE;
    this.color = COLORS.HOT_BLUE;
    this.sequence = [
      [0, 3],
      [3, 0],
      [0, -3],
      [-3, 0]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
