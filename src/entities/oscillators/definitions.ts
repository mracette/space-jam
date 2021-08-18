import { CircleOscillator1 } from "./CircleOscillator1";
import { CircleOscillator2 } from "./CircleOscillator2";
import { CircleOscillator3 } from "./CircleOscillator3";
import { SquareOscillator1 } from "./SquareOscillator1";
import { SquareOscillator2 } from "./SquareOscillator2";
import { SquareOscillator3 } from "./SquareOscillator3";
import { TriangleOscillator1 } from "./TriangleOscillator1";
import { TriangleOscillator2 } from "./TriangleOscillator2";
import { TriangleOscillator3 } from "./TriangleOscillator3";
import { COLORS } from "../../globals";

interface OscillatorDefinition {
  id: string;
  type: string;
  cost: number;
  buttonSize: number;
  color: string;
  class: unknown;
}

export const OSCILLATOR_DEFINITIONS: OscillatorDefinition[][] = [
  [
    {
      id: "c1",
      type: "cOsc",
      cost: 25,
      buttonSize: 0.15,
      color: COLORS.HOT_PINK,
      class: CircleOscillator1
    },
    {
      id: "c2",
      type: "cOsc",
      cost: 250,
      buttonSize: 0.15,
      color: COLORS.HOT_GREEN,
      class: CircleOscillator2
    },
    {
      id: "c3",
      type: "cOsc",
      cost: 2500,
      buttonSize: 0.15,
      color: COLORS.HOT_BLUE,
      class: CircleOscillator3
    }
  ],
  [
    {
      id: "t1",
      type: "tOsc",
      cost: 50,
      buttonSize: 0.3,
      color: COLORS.HOT_PINK,
      class: TriangleOscillator1
    },
    {
      id: "t2",
      type: "tOsc",
      cost: 500,
      buttonSize: 0.3,
      color: COLORS.HOT_GREEN,
      class: TriangleOscillator2
    },
    {
      id: "t3",
      type: "tOsc",
      cost: 5000,
      buttonSize: 0.3,
      color: COLORS.HOT_BLUE,
      class: TriangleOscillator3
    }
  ],
  [
    {
      id: "s1",
      type: "sOsc",
      cost: 1000,
      buttonSize: 0.3,
      color: COLORS.HOT_PINK,
      class: SquareOscillator1
    },
    {
      id: "s2",
      type: "sOsc",
      cost: 10000,
      buttonSize: 0.3,
      color: COLORS.HOT_GREEN,
      class: SquareOscillator2
    },
    {
      id: "s3",
      type: "sOsc",
      cost: 100000,
      buttonSize: 0.3,
      color: COLORS.HOT_BLUE,
      class: SquareOscillator3
    }
  ]
];
