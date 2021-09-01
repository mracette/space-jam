import { Instrument } from "./Instrument";

export class Basic3 extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.cost = 75;
    this.id = "in4";
    this.display = "B";
    this.notes = 5;
    this.outline = [
      [-1, 0],
      [0, 0],
      [0, 1],
      [2, 1],
      [2, -1],
      [1, -1],
      [1, -2],
      [-1, -2],
      [-1, 0]
    ];
    this.init();
  }
}
