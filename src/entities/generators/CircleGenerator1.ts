import { CircleGenerator, CircleGeneratorArgs } from "./CircleGenerator";
import { DURATIONS } from "../../globals";

export class CircleGenerator1 extends CircleGenerator {
  interval: DURATIONS;
  sequence: number[][];
  duration: number;
  radius: number;
  constructor(args: CircleGeneratorArgs = {}) {
    super(args);
    this.interval = DURATIONS.QUARTER;
    this.radius = 1;
    this.sequence = [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1]
    ];
    this.duration = this.interval * this.sequence.length;
    this.createRepeatingEvent();
  }
}
