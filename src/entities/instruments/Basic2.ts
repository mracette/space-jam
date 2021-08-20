import { Instrument } from "./Instrument";

export class Basic2 extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.id = "i2";
    this.notes = 5;
    this.outline = [
      [-1, 1],
      [2, 1],
      [2, -2],
      [-1, -2]
    ];
    this.init();
  }
}
