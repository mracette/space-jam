import { Instrument, InstrumentArgs } from "../Instrument";

const svg = require("../../svg/circle.0.svg");

type Circle1Args = Omit<InstrumentArgs, "dataUrl" | "notes">;

export class Circle1 extends Instrument {
  constructor(args: Circle1Args = {}) {
    super({ ...args, dataUrl: svg, notes: 5, scale: 3 });
  }
}
