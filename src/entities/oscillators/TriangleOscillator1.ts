import { TriangleOscillator } from "./TriangleOscillator";
import { DURATIONS } from "../../globals/audio";
import { COLORS } from "../../globals/colors";

export class TriangleOscillator1 extends TriangleOscillator {
  constructor(args: ConstructorParameters<typeof TriangleOscillator>[0] = {}) {
    super(args);
    this.display = "Triangle";
    this.interval = DURATIONS.QUARTER_TRIPLETS;
    this.cost = 50;
    this.color = COLORS.HOT_PINK;
    this.sequence = [
      [0, 1],
      [1, -1],
      [-1, -1]
    ];
    this.duration = this.interval * this.sequence.length;
    this.init();
  }
}
