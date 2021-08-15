import { Instrument, InstrumentArgs } from "../Instrument";

const svg = require("../../svg/circle.0.svg");

type Circle0Args = Omit<InstrumentArgs, "dataUrl">;

export class Circle0 extends Instrument {
  constructor(args: Circle0Args = {}) {
    super({ ...args, dataUrl: svg });
  }
}
