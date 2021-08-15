import Scheduler from "./core/AudioScheduler";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { CircleGenerator } from "./entities/generators/CircleGenerator";
import { Circle0 } from "./entities/instruments/Circle0";
import { MapEntity } from "./entities/MapEntity";
import { initializeEventListeners } from "./events";
import { ENTITY_ARRAY_DIMENSIONS, ENTITY_STATE, STATS } from "./globals";

interface EntityArrayElement {
  entity?: any;
  state?: ENTITY_STATE;
  stateDuration?: number;
}

export const ENTITY_ARRAY: EntityArrayElement[][] = Array.from({
  length: ENTITY_ARRAY_DIMENSIONS.W
}).map(() => Array.from({ length: ENTITY_ARRAY_DIMENSIONS.H }, Object));

export const AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();
export const SCHEDULER = new Scheduler(AUDIO_CTX);

const canvas = document.getElementById("canvas-viz") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const coords = new CanvasCoordinates(canvas);
const camera = new Camera();

initializeEventListeners(canvas, ctx, coords, camera);

new Circle0({ x: 1, y: 0 });
new CircleGenerator({ x: 0, y: 0 });

let prevTime = 0;
let delta = 0;

const main = (time: number) => {
  // clears canvas and canvas state
  canvas.width = canvas.clientWidth * window.devicePixelRatio || 1;
  canvas.height = canvas.clientHeight * window.devicePixelRatio || 1;
  delta = time - prevTime;
  prevTime = time;
  camera.render(ctx, coords, delta);
  prevTime;
  console.log(STATS.notes);
  window.requestAnimationFrame(main);
};

window.requestAnimationFrame(main);
