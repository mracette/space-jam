import { CircleOscillator, CircleOscillatorArgs } from "./CircleOscillator";
import { COLORS, DURATIONS } from "../../globals";
import { rgbWithAlpha } from "../../utils/colors";

export class CircleOscillator2 extends CircleOscillator {
  interval: DURATIONS;
  sequence: number[][];
  duration: number;
  radius: number;
  constructor(args: CircleOscillatorArgs) {
    super(args);
    this.interval = DURATIONS.HALF;
    this.radius = 2;
    this.color = COLORS.HOT_BLUE;
    this.colorDisabled = rgbWithAlpha(...COLORS.HOT_BLUE_RGB, 0.5);
    this.sequence = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
