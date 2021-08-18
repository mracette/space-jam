import { CircleOscillator, CircleOscillatorArgs } from "./CircleOscillator";
import { COLORS, DURATIONS } from "../../globals";
import { rgbWithAlpha } from "../../utils/colors";

export class CircleOscillator1 extends CircleOscillator {
  interval: DURATIONS;
  sequence: number[][];
  duration: number;
  radius: number;
  constructor(args: CircleOscillatorArgs = {}) {
    super(args);
    this.interval = DURATIONS.QUARTER;
    this.radius = 1;
    this.color = COLORS.HOT_PINK;
    this.colorDisabled = rgbWithAlpha(...COLORS.HOT_PINK_RGB, 0.5);
    this.sequence = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
