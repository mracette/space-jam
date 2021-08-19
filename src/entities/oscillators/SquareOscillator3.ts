import { SquareOscillator } from "./SquareOscillator";
import { COLORS, DURATIONS } from "../../globals";

export class SquareOscillator3 extends SquareOscillator {
  constructor(args: ConstructorParameters<typeof SquareOscillator>[0] = {}) {
    super(args);
    this.interval = DURATIONS.EIGHTH;
    this.id = "so1";
    this.cost = 100000;
    this.color = COLORS.HOT_BLUE;
    this.sequence = [
      [0, 3],
      [3, 3],
      [3, 0],
      [3, -3],
      [0, -3],
      [-3, -3],
      [-3, 0],
      [-3, 3]
    ];
    this.duration = this.interval * this.sequence.length;
    this.init();
  }
}
