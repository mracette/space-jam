import { CircleOscillator1 } from "./CircleOscillator1";
import { CircleOscillator2 } from "./CircleOscillator2";
import { TriangleOscillator1 } from "./TriangleOscillator1";
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
      color: COLORS.HOT_BLUE,
      class: CircleOscillator2
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
    }
  ]
];
