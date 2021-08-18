import { CircleGenerator, CircleGeneratorArgs } from "./CircleGenerator";
import { DURATIONS } from "../../globals";

export class CircleGenerator2 extends CircleGenerator {
  interval: DURATIONS;
  sequence: number[][];
  duration: number;
  radius: number;
  constructor(args: CircleGeneratorArgs) {
    super(args);
    this.interval = DURATIONS.HALF;
    this.radius = 2;
    this.sequence = [
      [2, 0],
      [0, -2],
      [-2, 0],
      [0, 2]
    ];
    this.duration = this.interval * this.sequence.length;
    this.createRepeatingEvent();
  }
}
