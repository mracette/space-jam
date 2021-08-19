import { Instrument } from "./Instrument";

export class Basic1 extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.notes = 1;
    this.shape = [[0, 0]];
    this.init();
  }
}
