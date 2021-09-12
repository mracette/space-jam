import { AspectRatio } from "../core/AspectRatio";

const enum MAP_DIMENSION_BASE {
  VALUE = 127 // must be odd
}

export const enum MAP_DIMENSIONS {
  W = MAP_DIMENSION_BASE.VALUE,
  W_HALF = (MAP_DIMENSION_BASE.VALUE - 1) / 2,
  H = MAP_DIMENSION_BASE.VALUE,
  H_HALF = (MAP_DIMENSION_BASE.VALUE - 1) / 2,
  MIN_X = -(MAP_DIMENSION_BASE.VALUE - 1) / 2,
  MAX_X = (MAP_DIMENSION_BASE.VALUE - 1) / 2,
  MIN_Y = -(MAP_DIMENSION_BASE.VALUE - 1) / 2,
  MAX_Y = (MAP_DIMENSION_BASE.VALUE - 1) / 2
}

export const enum ENTITY_ARRAY_DIMENSIONS {
  W = MAP_DIMENSION_BASE.VALUE,
  W_HALF = (MAP_DIMENSION_BASE.VALUE - 1) / 2,
  H = MAP_DIMENSION_BASE.VALUE,
  H_HALF = (MAP_DIMENSION_BASE.VALUE - 1) / 2,
  MIN_X = 0,
  MAX_X = MAP_DIMENSION_BASE.VALUE - 1,
  MIN_Y = 0,
  MAX_Y = MAP_DIMENSION_BASE.VALUE - 1
}

const enum VIEWPORT_DIMENSION_BASE {
  VALUE = 15 // must be odd
}

export const enum VIEWPORT_DIMENSIONS {
  W = VIEWPORT_DIMENSION_BASE.VALUE,
  H = VIEWPORT_DIMENSION_BASE.VALUE,
  W_HALF = (VIEWPORT_DIMENSION_BASE.VALUE - 1) / 2,
  H_HALF = (VIEWPORT_DIMENSION_BASE.VALUE - 1) / 2
}

const enum TILE_DIMENSION_BASE {
  VALUE = 0.06 // proportion of canvas width
}

export const enum TILE_DIMENSIONS {
  SIZE = TILE_DIMENSION_BASE.VALUE,
  HALF = TILE_DIMENSION_BASE.VALUE / 2,
  QUARTER = TILE_DIMENSION_BASE.VALUE / 4
}

const enum LINE_WIDTH_BASE {
  VALUE = 0.006 // proportion of canvas width
}

export const enum LINE_WIDTH {
  VALUE = LINE_WIDTH_BASE.VALUE,
  HALF = LINE_WIDTH_BASE.VALUE / 2,
  DOUBLE = LINE_WIDTH_BASE.VALUE * 2
}

const enum FONT_SIZE_BASE {
  VALUE = 0.0375
}

export const enum FONT_SIZE {
  TRIPLE = FONT_SIZE_BASE.VALUE * 3,
  DOUBLE = FONT_SIZE_BASE.VALUE * 2,
  VALUE = FONT_SIZE_BASE.VALUE,
  HALF = FONT_SIZE_BASE.VALUE / 2
}

export const enum MARGIN_TOP_STATS {
  VALUE = -0.78
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

export const ASPECT_RATIO = new AspectRatio(9, 16);
