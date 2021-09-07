import { CanvasCoordinates } from "../core/Coords";
import { ELEMENTS } from "../globals/dom";
import { CAMERA } from "../globals/game";
import { MAP_DIMENSIONS, TILE_DIMENSIONS } from "../globals/sizes";

export const COORDS = new CanvasCoordinates(ELEMENTS.canvasTiles);

export const entityArrayToMap = {
  x: (x: number): number => x - MAP_DIMENSIONS.W_HALF,
  y: (y: number): number => y - MAP_DIMENSIONS.H_HALF
};

export const mapToEntityArray = {
  x: (x: number): number => x + MAP_DIMENSIONS.W_HALF,
  y: (y: number): number => y + MAP_DIMENSIONS.H_HALF
};

export const mapToScreen = {
  x: (x: number): number =>
    COORDS.width(0.5) + // centers in canvas
    (x - CAMERA.position.x) * COORDS.width(TILE_DIMENSIONS.SIZE) - // scales map position to tile size relative to camera
    COORDS.width(TILE_DIMENSIONS.HALF), // centers within grid
  y: (y: number): number =>
    COORDS.height(0.5) + // centers in canvas
    (CAMERA.position.y - y) * COORDS.width(TILE_DIMENSIONS.SIZE) - // scales map position to tile size relative to camera
    COORDS.width(TILE_DIMENSIONS.HALF) // centers within grid
};

export const screenToMap = {
  x: (x: number): number => {
    // using ELEMENTS.canvasTiles works because all canvas element are always the same size
    const { left, right } = ELEMENTS.canvasTiles.getBoundingClientRect();
    if (x < left || x > right) {
      return undefined;
    } else {
      const tilesInCanvasX = COORDS.width() / COORDS.width(TILE_DIMENSIONS.SIZE);
      const xNormal = (x - left) / COORDS.width(1, true); // [0, 1] across canvas
      const xMap = -tilesInCanvasX / 2 + xNormal * tilesInCanvasX + CAMERA.position.x;
      return Math.round(xMap);
    }
  },
  y: (y: number): number => {
    // using ELEMENTS.canvasTiles works because all canvas element are always the same size
    const { top, bottom } = ELEMENTS.canvasTiles.getBoundingClientRect();
    if (y < top || y > bottom) {
      return undefined;
    } else {
      const tilesInCanvasY = COORDS.height() / COORDS.width(TILE_DIMENSIONS.SIZE);
      const yNormal = (bottom - y - top) / COORDS.height(1, true); // [0, 1] across canvas
      const yMap = -tilesInCanvasY / 2 + yNormal * tilesInCanvasY + CAMERA.position.y;
      return Math.round(yMap);
    }
  }
};

export const entityArrayToScreen = {
  x: (x: number): number => mapToScreen.x(entityArrayToMap.x(x)),
  y: (y: number): number => mapToScreen.y(entityArrayToMap.y(y))
};

export const isUndefined = (value: unknown): boolean => {
  return typeof value === "undefined";
};
