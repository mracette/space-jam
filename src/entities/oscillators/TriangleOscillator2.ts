import { TriangleOscillator } from "./TriangleOscillator";
import { DURATIONS } from "../../globals";
import { COLORS } from "../../globals/colors";

export class TriangleOscillator2 extends TriangleOscillator {
  constructor(args: ConstructorParameters<typeof TriangleOscillator>[0] = {}) {
    super(args);
    this.interval = DURATIONS.HALF_TRIPLETS;
    this.id = "to1";
    this.cost = 500;
    this.color = COLORS.HOT_GREEN;
    this.sequence = [
      [0, 2],
      [2, -2],
      [-2, -2]
    ];
    this.duration = this.interval * this.sequence.length;
    this.init();
  }
}
