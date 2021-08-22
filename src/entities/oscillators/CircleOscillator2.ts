import { CircleOscillator } from "./CircleOscillator";
import { DURATIONS } from "../../globals/audio";
import { COLORS } from "../../globals/colors";

export class CircleOscillator2 extends CircleOscillator {
  constructor(args: ConstructorParameters<typeof CircleOscillator>[0] = {}) {
    super(args);
    this.id = "co2";
    this.cost = 250;
    this.interval = DURATIONS.HALF;
    this.color = COLORS.HOT_GREEN;
    this.sequence = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0]
    ];
    this.duration = this.interval * this.sequence.length;
    this.init();
  }
}
