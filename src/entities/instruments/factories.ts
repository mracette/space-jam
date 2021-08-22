import { Basic1 } from "./Basic1";
import { Basic2 } from "./Basic2";
import { Basic3 } from "./Basic3";
import { Instrument } from "./Instrument";

export const INSTRUMENT_FACTORIES = [
  (args: ConstructorParameters<typeof Instrument>[0]): Basic1 => new Basic1(args),
  (args: ConstructorParameters<typeof Instrument>[0]): Basic2 => new Basic2(args),
  (args: ConstructorParameters<typeof Instrument>[0]): Basic3 => new Basic3(args)
];

export type AnyInstrument = ReturnType<typeof INSTRUMENT_FACTORIES[number]>;

export const INSTRUMENT_LIST = INSTRUMENT_FACTORIES.map((factory) =>
  factory({ preview: true })
);
