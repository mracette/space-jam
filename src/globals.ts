import { CanvasCoordinates } from "./core/Coords";

const enum MAP_DIMENSION {
  SIZE = 15 // must be odd
}

export const enum MAP_DIMENSIONS {
  W = MAP_DIMENSION.SIZE,
  W_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  H = MAP_DIMENSION.SIZE,
  H_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  MIN_X = -(MAP_DIMENSION.SIZE - 1) / 2,
  MAX_X = (MAP_DIMENSION.SIZE - 1) / 2,
  MIN_Y = -(MAP_DIMENSION.SIZE - 1) / 2,
  MAX_Y = (MAP_DIMENSION.SIZE - 1) / 2
}

const enum VIEWPORT_DIMENSION {
  SIZE = 9 // must be odd
}
export const enum VIEWPORT_DIMENSIONS {
  W = VIEWPORT_DIMENSION.SIZE,
  H = VIEWPORT_DIMENSION.SIZE,
  W_HALF = (VIEWPORT_DIMENSION.SIZE - 1) / 2,
  H_HALF = (VIEWPORT_DIMENSION.SIZE - 1) / 2
}

export const enum ENTITY_ARRAY_DIMENSIONS {
  W = MAP_DIMENSION.SIZE,
  W_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  H = MAP_DIMENSION.SIZE,
  H_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  MIN_X = 0,
  MAX_X = MAP_DIMENSION.SIZE - 1,
  MIN_Y = 0,
  MAX_Y = MAP_DIMENSION.SIZE - 1
}

export const enum TILE_DIMENSIONS {
  SIZE = 0.05 // as a percentage of the canvas width
}

export const MOUSE_POSITION: {
  screenX: number;
  screenY: number;
  mapX: number;
  mapY: number;
} = {
  screenX: undefined,
  screenY: undefined,
  mapX: undefined,
  mapY: undefined
};

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
  GRADIENT_FOG = ctx.createRadialGradient(
    coords.nx(0),
    coords.ny(0),
    coords.width((VIEWPORT_DIMENSIONS.W / 4) * TILE_DIMENSIONS.SIZE),
    coords.nx(0),
    coords.ny(0),
    coords.width((VIEWPORT_DIMENSIONS.W / 2) * TILE_DIMENSIONS.SIZE)
  );
  GRADIENT_FOG.addColorStop(0, COLORS.clear);
  GRADIENT_FOG.addColorStop(0, COLORS.clear);
  GRADIENT_FOG.addColorStop(1, COLORS.background);
};
