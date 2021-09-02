import { IHat } from "./IHat";
import { IKick } from "./IKick";
import { Instrument } from "./Instrument";
import { IOrganSynth } from "./IOrganSynth";
import { ISawSynth } from "./ISawSynth";
import { ISineSynth } from "./ISineSynth";
import { ISnare } from "./ISnare";
import { ISquareSynth } from "./ISquareSynth";
import { ITom } from "./ITom";

export const INSTRUMENT_FACTORIES = {
  in3: (args: ConstructorParameters<typeof Instrument>[0]): IHat => new IHat(args),
  in4: (args: ConstructorParameters<typeof Instrument>[0]): ITom => new ITom(args),
  in2: (args: ConstructorParameters<typeof Instrument>[0]): ISnare => new ISnare(args),
  in1: (args: ConstructorParameters<typeof Instrument>[0]): IKick => new IKick(args),
  in5: (args: ConstructorParameters<typeof Instrument>[0]): IOrganSynth =>
    new IOrganSynth(args),
  in6: (args: ConstructorParameters<typeof Instrument>[0]): ISawSynth =>
    new ISawSynth(args),
  in7: (args: ConstructorParameters<typeof Instrument>[0]): ISineSynth =>
    new ISineSynth(args),
  in8: (args: ConstructorParameters<typeof Instrument>[0]): ISquareSynth =>
    new ISquareSynth(args)
};

export type InstrumentId = keyof typeof INSTRUMENT_FACTORIES;

export type AnyInstrument = ReturnType<typeof INSTRUMENT_FACTORIES[InstrumentId]>;

export const INSTRUMENT_LIST: AnyInstrument[] = Object.values(INSTRUMENT_FACTORIES).map(
  (factory) => factory({ preview: true })
);
