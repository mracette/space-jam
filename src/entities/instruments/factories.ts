import { Basic3 } from "./Basic3";
import { IHat } from "./IHat";
import { IKick } from "./IKick";
import { Instrument } from "./Instrument";
import { ISnare } from "./ISnare";
import { ITom } from "./ITom";

export const INSTRUMENT_FACTORIES = {
  in1: (args: ConstructorParameters<typeof Instrument>[0]): IKick => new IKick(args),
  in2: (args: ConstructorParameters<typeof Instrument>[0]): ISnare => new ISnare(args),
  in3: (args: ConstructorParameters<typeof Instrument>[0]): IHat => new IHat(args),
  in4: (args: ConstructorParameters<typeof Instrument>[0]): ITom => new ITom(args)
};

export type InstrumentId = keyof typeof INSTRUMENT_FACTORIES;

export type AnyInstrument = ReturnType<typeof INSTRUMENT_FACTORIES[InstrumentId]>;

export const INSTRUMENT_LIST: AnyInstrument[] = Object.values(INSTRUMENT_FACTORIES).map(
  (factory) => factory({ preview: true })
);
