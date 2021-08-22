import { CircleOscillator } from "./CircleOscillator";
import { DURATIONS } from "../../globals/audio";
import { COLORS } from "../../globals/colors";

export class CircleOscillator1 extends CircleOscillator {
  constructor(args: ConstructorParameters<typeof CircleOscillator>[0] = {}) {
    super(args);
    this.id = "co1";
    this.cost = 25;
    this.color = COLORS.HOT_PINK;
    this.interval = DURATIONS.QUARTER;
    this.sequence = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0]
    ];
    this.duration = this.interval * this.sequence.length;
    this.init();
  }
}
