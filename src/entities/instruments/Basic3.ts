import { Instrument } from "./Instrument";

export class Basic3 extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "i3";
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
