import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import {
  COLORS,
  TILE_DIMENSIONS,
  updateScreenDependentGlobals,
  VIEWPORT_DIMENSIONS,
  WORLD_DIMENSIONS
} from "./globals";
import { resizeWithAspectRatio } from "./utils/resizeWithAspectRatio";

export const WORLD_MAP = new Array(WORLD_DIMENSIONS.X).fill(
  new Array(WORLD_DIMENSIONS.Y).fill(null)
);

const canvas = document.getElementById("canvas-viz") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
resizeWithAspectRatio(canvas, new AspectRatio(9, 16));
const coords = new CanvasCoordinates(canvas);
const camera = new Camera();

const onResize = () => {
  updateScreenDependentGlobals(ctx, coords);
};

const observer = new ResizeObserver(onResize);
observer.observe(canvas);

const main = () => {
  ctx.clearRect(0, 0, coords.width(), coords.height());
  camera.update(0);
  camera.render(ctx, coords);
  window.requestAnimationFrame(main);
};
window.requestAnimationFrame(main);
