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
