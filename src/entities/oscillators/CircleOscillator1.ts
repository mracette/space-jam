import { CircleOscillator } from "./CircleOscillator";
import { DURATIONS } from "../../globals/audio";
import { COLORS } from "../../globals/colors";

export class CircleOscillator1 extends CircleOscillator {
  constructor(args: ConstructorParameters<typeof CircleOscillator>[0] = {}) {
    super(args);
    this.display = "Circle";
    this.cost = 25;
    this.radius = 1;
    this.color = COLORS.HOT_PINK;
    this.interval = DURATIONS.QUARTER;
    this.init();
  }
}
