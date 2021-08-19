import Scheduler from "./core/AudioScheduler";
import { CanvasCoordinates } from "./core/COORDS";
import { Camera } from "./entities/Camera";
import { Basic1 } from "./entities/instruments/Basic1";
import { Basic2 } from "./entities/instruments/Basic2";
import { INSTRUMENT_DEFINITIONS } from "./entities/instruments/definitions";
import { CircleOscillator1 } from "./entities/oscillators/CircleOscillator1";
import { OSCILLATOR_DEFINITIONS } from "./entities/oscillators/definitions";
import { initializeEventListeners } from "./events";
import { ELEMENTS, ENTITY_ARRAY_DIMENSIONS, ENTITY_STATE } from "./globals";
import { setupOscillatorUI, setUpPerlinNoise } from "./setup";

export interface EntityArrayElement {
  entity?: typeof OSCILLATOR_DEFINITIONS[number] & typeof INSTRUMENT_DEFINITIONS[number];
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
setUpPerlinNoise();

// new Basic1({ x: 0, y: 0 });
new Basic2({ x: 1, y: 1 });
new CircleOscillator1({ x: -1, y: 0 });

const main = () => {
  CAMERA.render();
  window.requestAnimationFrame(main);
};

// runs animations pegged to camera movement
CAMERA.move(0, 0);

window.requestAnimationFrame(main);
