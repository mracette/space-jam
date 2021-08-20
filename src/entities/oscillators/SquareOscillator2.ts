import { SquareOscillator } from "./SquareOscillator";
import { DURATIONS } from "../../globals";
import { COLORS } from "../../globals/colors";

export class SquareOscillator2 extends SquareOscillator {
  constructor(args: ConstructorParameters<typeof SquareOscillator>[0] = {}) {
    super(args);
    this.interval = DURATIONS.EIGHTH;
    this.id = "so1";
    this.cost = 10000;
    this.color = COLORS.HOT_GREEN;
    this.sequence = [
      [0, 2],
      [2, 2],
      [2, 0],
      [2, -2],
      [0, -2],
      [-2, -2],
      [-2, 0],
      [-2, 2]
    ];
    this.duration = this.interval * this.sequence.length;
    this.init();
  }
}
