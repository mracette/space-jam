import { CanvasCoordinates } from "./core/Coords";

const enum MAP_DIMENSION {
  SIZE = 255 // must be odd
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
  SIZE = 19 // must be odd
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
  CLEAR: "rgba(0,0,0,0)",
  WHITE: "#FFFFFF",
  BACKGROUND: "#272838",
  MAIN_GREEN: "#5bba6f",
  MAIN_GREEN_RGB: [91, 186, 111],
  MAIN_PURPLE: "#7C77B9",
  MAIN_PURPLE_RGB: [124, 119, 185]
};

export let GRADIENT_FOG: CanvasGradient;

export const updateScreenDependentGlobals = (
  ctx: CanvasRenderingContext2D,
  coords: CanvasCoordinates
): void => {
  GRADIENT_FOG = ctx.createRadialGradient(
    coords.nx(0),
    coords.ny(0),
    coords.width((VIEWPORT_DIMENSIONS.W_HALF / 2) * TILE_DIMENSIONS.SIZE),
    coords.nx(0),
    coords.ny(0),
    coords.width(VIEWPORT_DIMENSIONS.W_HALF * TILE_DIMENSIONS.SIZE)
  );
  GRADIENT_FOG.addColorStop(0, COLORS.CLEAR);
  GRADIENT_FOG.addColorStop(0.25, COLORS.CLEAR);
  GRADIENT_FOG.addColorStop(1, COLORS.BACKGROUND);
};

export const TAU = Math.PI * 2;

export const enum SAMPLE_RATE {
  VALUE = 44100
}

export const enum LINE_WIDTH {
  VALUE = 0.006
}

export const enum BPM {
  VALUE = 70,
  BPS = 70 / 60,
  SPB = 60 / 70
}

export const enum DURATIONS {
  WHOLE = BPM.SPB * 4,
  HALF = BPM.SPB * 2,
  QUARTER = BPM.SPB,
  EIGHT = BPM.SPB / 2,
  SIXTEENTH = BPM.SPB / 4
}

export const enum ENTITY_STATE {
  PLAYING = 0,
  STOPPED = 1
}

export const enum LIGHT_UP_DURATION {
  VALUE = 0.5
}

export const STATS = {
  notes: 0
};
