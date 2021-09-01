import { CircleOscillator1 } from "./CircleOscillator1";
import { SquareOscillator1 } from "./SquareOscillator1";
import { TriangleOscillator1 } from "./TriangleOscillator1";

export const OSCILLATOR_FACTORIES = {
  co1: (args: ConstructorParameters<typeof CircleOscillator1>[0]): CircleOscillator1 =>
    new CircleOscillator1(args),
  to1: (
    args: ConstructorParameters<typeof TriangleOscillator1>[0]
  ): TriangleOscillator1 => new TriangleOscillator1(args),
  so1: (args: ConstructorParameters<typeof SquareOscillator1>[0]): SquareOscillator1 =>
    new SquareOscillator1(args)
};

export type OscillatorIds = keyof typeof OSCILLATOR_FACTORIES;

export type AnyOscillator = ReturnType<typeof OSCILLATOR_FACTORIES[OscillatorIds]>;

export const OSCILLATOR_LIST: AnyOscillator[] = Object.values(OSCILLATOR_FACTORIES).map(
  (factory) => factory({ preview: true })
);
