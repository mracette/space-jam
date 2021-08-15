import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { Circle0 } from "./entities/instruments/Circle0";
import { initializeEventListeners } from "./events";
import { ENTITY_ARRAY_DIMENSIONS } from "./globals";

export const ENTITY_ARRAY = new Array(ENTITY_ARRAY_DIMENSIONS.W).fill(
  new Array(ENTITY_ARRAY_DIMENSIONS.H).fill(null)
);

const canvas = document.getElementById("canvas-viz") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const coords = new CanvasCoordinates(canvas);
const camera = new Camera();

initializeEventListeners(canvas, ctx, coords, camera);

new Circle0({ x: 1, y: 1 });

let prevTime = 0;
let delta = 0;

const main = (time: number) => {
  // clears canvas and canvas state
  canvas.width = canvas.clientWidth * window.devicePixelRatio || 1;
  canvas.height = canvas.clientHeight * window.devicePixelRatio || 1;
  delta = time - prevTime;
  prevTime = time;
  camera.render(ctx, coords);
  prevTime;
  window.requestAnimationFrame(main);
};

window.requestAnimationFrame(main);
