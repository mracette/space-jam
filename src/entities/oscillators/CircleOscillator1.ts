import { CircleOscillator, CircleOscillatorArgs } from "./CircleOscillator";
import { DURATIONS } from "../../globals";

export class CircleOscillator1 extends CircleOscillator {
  interval: DURATIONS;
  sequence: number[][];
  duration: number;
  radius: number;
  constructor(args: CircleOscillatorArgs = {}) {
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
