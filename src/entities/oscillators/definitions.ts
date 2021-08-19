import { CircleOscillator1 } from "./CircleOscillator1";
import { CircleOscillator2 } from "./CircleOscillator2";
import { CircleOscillator3 } from "./CircleOscillator3";
import { SquareOscillator1 } from "./SquareOscillator1";
import { SquareOscillator2 } from "./SquareOscillator2";
import { SquareOscillator3 } from "./SquareOscillator3";
import { TriangleOscillator1 } from "./TriangleOscillator1";
import { TriangleOscillator2 } from "./TriangleOscillator2";
import { TriangleOscillator3 } from "./TriangleOscillator3";

const args = { preview: true };

export const OSCILLATOR_DEFINITIONS = [
  new CircleOscillator1(args),
  new CircleOscillator2(args),
  new CircleOscillator3(args),
  new TriangleOscillator1(args),
  new TriangleOscillator2(args),
  new TriangleOscillator3(args),
  new SquareOscillator1(args),
  new SquareOscillator2(args),
  new SquareOscillator3(args)
];

export const OSCILLATOR_CONSTRUCTORS = [
  CircleOscillator1,
  CircleOscillator2,
  CircleOscillator3,
  TriangleOscillator1,
  TriangleOscillator2,
  TriangleOscillator3,
  SquareOscillator1,
  SquareOscillator2,
  SquareOscillator3
];