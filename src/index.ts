import Scheduler from "./core/AudioScheduler";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { Basic1 } from "./entities/instruments/Basic1";
import { Basic2 } from "./entities/instruments/Basic2";
import { Basic3 } from "./entities/instruments/Basic3";
import { INSTRUMENT_ENTITIES } from "./entities/instruments/entities";
import { OSCILLATOR_DEFINITIONS } from "./entities/oscillators/definitions";
import { initializeEventListeners } from "./events";
import { ELEMENTS, ENTITY_ARRAY_DIMENSIONS, ENTITY_STATE } from "./globals";
import { setupOscillatorUI } from "./setup";

// @ts-ignore
import * as Stats from "stats.js";

export interface EntityArrayElement {
  entity?: typeof OSCILLATOR_DEFINITIONS[number] & typeof INSTRUMENT_ENTITIES[number];
  state?: ENTITY_STATE;
  stateEndsTime?: number;
  blocked?: boolean;
}

export const ENTITY_ARRAY: EntityArrayElement[][] = Array.from({
  length: ENTITY_ARRAY_DIMENSIONS.W
}).map(() => Array.from({ length: ENTITY_ARRAY_DIMENSIONS.H }, Object));

export const AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();
export const SCHEDULER = new Scheduler(AUDIO_CTX);
export const COORDS = new CanvasCoordinates(ELEMENTS.canvasTiles);
export const CAMERA = new Camera({ coords: COORDS });

initializeEventListeners();
setupOscillatorUI();

new Basic3({ x: 1, y: 1 });
new Basic2({ x: -3, y: 3 });
new Basic1({ x: -3, y: -3 });
// new CircleOscillator1({ x: -1, y: 0 });

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
stats.dom.style.width = "unset";
stats.dom.style.height = "unset";

const main = () => {
  stats.begin();
  CAMERA.render();
  stats.end();
  window.requestAnimationFrame(main);
};

// runs animations pegged to camera movement
CAMERA.move(0, 0);

window.requestAnimationFrame(main);
