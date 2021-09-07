import { HiHat } from "./HiHat";
import { Instrument } from "./Instrument";
import { Kick } from "./Kick";
import { OrganSynth } from "./OrganSynth";
import { SawSynth } from "./SawSynth";
import { SineSynth } from "./SineSynth";
import { Snare } from "./Snare";
import { SquareSynth } from "./SquareSynth";
import { Tom } from "./Tom";

export const INSTRUMENT_FACTORIES = [
  (args: ConstructorParameters<typeof Instrument>[0]): HiHat => new HiHat(args),
  (args: ConstructorParameters<typeof Instrument>[0]): Tom => new Tom(args),
  (args: ConstructorParameters<typeof Instrument>[0]): Snare => new Snare(args),
  (args: ConstructorParameters<typeof Instrument>[0]): Kick => new Kick(args),
  (args: ConstructorParameters<typeof Instrument>[0]): OrganSynth => new OrganSynth(args),
  (args: ConstructorParameters<typeof Instrument>[0]): SawSynth => new SawSynth(args),
  (args: ConstructorParameters<typeof Instrument>[0]): SineSynth => new SineSynth(args),
  (args: ConstructorParameters<typeof Instrument>[0]): SquareSynth =>
    new SquareSynth(args)
];

export type InstrumentFactory = typeof INSTRUMENT_FACTORIES[number];
