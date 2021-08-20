import { SquareOscillator } from "./SquareOscillator";
import { DURATIONS } from "../../globals";
import { COLORS } from "../../globals/colors";

export class SquareOscillator1 extends SquareOscillator {
  constructor(args: ConstructorParameters<typeof SquareOscillator>[0] = {}) {
    super(args);
    this.interval = DURATIONS.SIXTEENTH;
    this.id = "so1";
    this.cost = 1000;
    this.color = COLORS.HOT_PINK;
    this.sequence = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1]
    ];
    this.duration = this.interval * this.sequence.length;
    this.init();
  }
}
