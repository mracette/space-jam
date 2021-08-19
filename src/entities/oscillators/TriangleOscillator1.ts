import { TriangleOscillator } from "./TriangleOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class TriangleOscillator1 extends TriangleOscillator {
  constructor(args: ConstructorParameters<typeof TriangleOscillator>[0] = {}) {
    super(args);
    this.interval = DURATIONS.QUARTER_TRIPLETS;
    this.id = "to1";
    this.cost = 50;
    this.color = COLORS.HOT_PINK;
    this.sequence = [
      [0, 1],
      [1, -1],
      [-1, -1]
    ];
    this.duration = this.interval * this.sequence.length;
  }
}
