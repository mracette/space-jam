import { CanvasCoordinates } from "./core/Coords";

export const enum WORLD_DIMENSIONS {
  X = 9,
  Y = 9
}

export const enum VIEWPORT_DIMENSIONS {
  X = 15,
  Y = 15
}

export const enum TILE_DIMENSIONS {
  SIZE = 0.05 // as a percentage of the canvas width
}

export const COLORS = {
  clear: "rgba(0,0,0,0)",
  white: "#FFFFFF",
  background: "#272838",
  mainGreen: "#5BBA6F",
  mainPurple: "#7C77B9"
};

export let GRADIENT_FOG: CanvasGradient;

export const updateScreenDependentGlobals = (
  ctx: CanvasRenderingContext2D,
  coords: CanvasCoordinates
): void => {
  console.log(coords.nx(0), coords.canvas.width);
  GRADIENT_FOG = ctx.createRadialGradient(
    coords.nx(0),
    coords.ny(0),
    coords.width((VIEWPORT_DIMENSIONS.X / 4) * TILE_DIMENSIONS.SIZE),
    coords.nx(0),
    coords.ny(0),
    coords.width((VIEWPORT_DIMENSIONS.X / 2) * TILE_DIMENSIONS.SIZE)
  );
  GRADIENT_FOG.addColorStop(0, COLORS.clear);
  GRADIENT_FOG.addColorStop(0, COLORS.clear);
  GRADIENT_FOG.addColorStop(1, COLORS.background);
};
