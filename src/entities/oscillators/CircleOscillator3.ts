import { CircleOscillator } from "./CircleOscillator";
import { DURATIONS } from "../../globals/audio";
import { COLORS } from "../../globals/colors";

export class CircleOscillator3 extends CircleOscillator {
  constructor(args: ConstructorParameters<typeof CircleOscillator>[0] = {}) {
    super(args);
    this.id = "co3";
    this.cost = 2500;
    this.radius = 3;
    this.interval = DURATIONS.WHOLE;
    this.color = COLORS.HOT_BLUE;
    this.init();
  }
}
