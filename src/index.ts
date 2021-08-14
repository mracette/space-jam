import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { WORLD_DIMENSIONS } from "./globals";
import { resizeWithAspectRatio } from "./utils/resizeWithAspectRatio";

export const WORLD_MAP = new Array(WORLD_DIMENSIONS.X).fill(
  new Array(WORLD_DIMENSIONS.Y).fill(null)
);

const canvas = document.getElementById("canvas-viz") as HTMLCanvasElement;
resizeWithAspectRatio(canvas, new AspectRatio(9, 16));
const coords = new CanvasCoordinates(canvas);
const camera = new Camera();
