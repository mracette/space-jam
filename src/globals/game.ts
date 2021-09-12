import { TAU } from "./math";
import { ENTITY_ARRAY_DIMENSIONS } from "./sizes";
import { Camera } from "../entities/Camera";
import { Instrument } from "../entities/instruments/Instrument";
import { Oscillator } from "../entities/oscillators/Oscillator";
import { COORDS } from "../utils/conversions";

export const DEBUG = false;

export const enum ENTITY_STATE {
  PLAYING = "playing",
  STOPPED = "stopped"
}

export const STATE = {
  entitiesPlaced: 0,
  hints: {
    drag: false,
    menu: true,
    escape: false
  },
  showEscapeHints: true,
  menuVisible: false,
  inspectVisible: false
};

export const STATS = {
  currentNotes: 0,
  totalNotes: 0
};

export const CAMERA = new Camera({ coords: COORDS });

export interface EntityArrayElement {
  entity?: Instrument | Oscillator;
  state?: ENTITY_STATE;
  blocked?: boolean;
}

export const ENTITY_ARRAY: EntityArrayElement[][] = Array.from({
  length: ENTITY_ARRAY_DIMENSIONS.W
}).map(() => Array.from({ length: ENTITY_ARRAY_DIMENSIONS.H }, Object));

const STAR_BASE_SIZE = 0.001;

export const RANDOM_STARS = new Array(100)
  .fill(null)
  .map(() => [
    1 - 2 * Math.random(),
    1 - 2 * Math.random(),
    STAR_BASE_SIZE * (1 + Math.random()),
    Math.random() * TAU
  ]);

const COUNT_STREAK_POINTS = 10;

export const RANDOM_STREAKS = new Array(2)
  .fill(null)
  .map(() =>
    new Array(COUNT_STREAK_POINTS)
      .fill(null)
      .map((_, i) => [0.5 - Math.random(), -1.1 + (2.2 * i) / (COUNT_STREAK_POINTS - 1)])
  );
