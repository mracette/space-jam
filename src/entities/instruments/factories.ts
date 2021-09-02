import { IHat } from "./IHat";
import { IKick } from "./IKick";
import { Instrument } from "./Instrument";
import { IOrganSynth } from "./IOrganSynth";
import { ISawSynth } from "./ISawSynth";
import { ISineSynth } from "./ISineSynth";
import { ISnare } from "./ISnare";
import { ISquareSynth } from "./ISquareSynth";
import { ITom } from "./ITom";

export const INSTRUMENT_FACTORIES = [
  (args: ConstructorParameters<typeof Instrument>[0]): IHat => new IHat(args),
  (args: ConstructorParameters<typeof Instrument>[0]): ITom => new ITom(args),
  (args: ConstructorParameters<typeof Instrument>[0]): ISnare => new ISnare(args),
  (args: ConstructorParameters<typeof Instrument>[0]): IKick => new IKick(args),
  (args: ConstructorParameters<typeof Instrument>[0]): IOrganSynth =>
    new IOrganSynth(args),
  (args: ConstructorParameters<typeof Instrument>[0]): ISawSynth => new ISawSynth(args),
  (args: ConstructorParameters<typeof Instrument>[0]): ISineSynth => new ISineSynth(args),
  (args: ConstructorParameters<typeof Instrument>[0]): ISquareSynth =>
    new ISquareSynth(args)
];

export type InstrumentFactory = typeof INSTRUMENT_FACTORIES[number];
