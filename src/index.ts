import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { Circle0 } from "./entities/instruments/Circle0";
import {
  updateScreenDependentGlobals,
  ENTITY_ARRAY_DIMENSIONS,
  MOUSE_POSITION
} from "./globals";
import { screenToMap } from "./utils/conversions";
import { resizeWithAspectRatio } from "./utils/resizeWithAspectRatio";

export const ENTITY_ARRAY = new Array(ENTITY_ARRAY_DIMENSIONS.W).fill(
  new Array(ENTITY_ARRAY_DIMENSIONS.H).fill(null)
);

const canvas = document.getElementById("canvas-viz") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
resizeWithAspectRatio(canvas, new AspectRatio(9, 16));
const coords = new CanvasCoordinates(canvas);
const camera = new Camera();

const onMouseMove = (e: MouseEvent) => {
  MOUSE_POSITION.screenX = e.x;
  MOUSE_POSITION.screenY = e.y;
  screenToMap.x(e.x, coords, camera, canvas);
};

window.addEventListener("mousemove", onMouseMove);

const onResize = () => {
  updateScreenDependentGlobals(ctx, coords);
  main();
};

const observer = new ResizeObserver(onResize);
observer.observe(canvas);

const circleTest = new Circle0({ x: 1, y: 1 });

const main = () => {
  ctx.clearRect(0, 0, coords.width(), coords.height());
  camera.update(0);
  camera.render(ctx, coords);
  window.requestAnimationFrame(main);
};
window.requestAnimationFrame(main);
