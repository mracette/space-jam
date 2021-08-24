import { SquareOscillator } from "./SquareOscillator";
import { DURATIONS } from "../../globals/audio";
import { COLORS } from "../../globals/colors";

export class SquareOscillator3 extends SquareOscillator {
  constructor(args: ConstructorParameters<typeof SquareOscillator>[0] = {}) {
    super(args);
    this.interval = DURATIONS.EIGHTH;
    this.id = "so3";
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
