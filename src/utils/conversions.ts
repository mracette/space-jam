import { CanvasCoordinates } from "../core/Coords";
import { Camera } from "../entities/Camera";
import { MAP_DIMENSIONS, TILE_DIMENSIONS, VIEWPORT_DIMENSIONS } from "../globals";

export const entityArrayToMap = {
  x: (x: number): number => x - MAP_DIMENSIONS.W_HALF,
  y: (y: number): number => y - MAP_DIMENSIONS.H_HALF
};

export const mapToEntityArray = {
  x: (x: number): number => x + MAP_DIMENSIONS.W_HALF,
  y: (y: number): number => y + MAP_DIMENSIONS.H_HALF
};

export const mapToScreen = {
  x: (x: number, coords: CanvasCoordinates, camera: Camera): number =>
    coords.width(0.5) + // centers in canvas
    (x - camera.position.x) * coords.width(TILE_DIMENSIONS.SIZE) - // scales map position to tile size relative to camera
    coords.width(TILE_DIMENSIONS.HALF), // centers within grid
  y: (y: number, coords: CanvasCoordinates, camera: Camera): number =>
    coords.height(0.5) + // centers in canvas
    (camera.position.y - y) * coords.width(TILE_DIMENSIONS.SIZE) - // scales map position to tile size relative to camera
    coords.width(TILE_DIMENSIONS.HALF) // centers within grid
};

export const screenToMap = {
  x: (
    x: number,
    coords: CanvasCoordinates,
    camera: Camera,
    canvas: HTMLCanvasElement
  ): number => {
    const { left, right } = canvas.getBoundingClientRect();
    if (x < left || x > right) {
      return undefined;
    } else {
      const widthTiles = coords.width() / coords.width(TILE_DIMENSIONS.SIZE);
      const n = (2 * (x - left)) / coords.width(); // [0, 1] across canvas
      const nTile = -widthTiles / 2 + n * widthTiles + camera.position.x;
      return Math.round(nTile);
    }
  },
  y: (
    y: number,
    coords: CanvasCoordinates,
    camera: Camera,
    canvas: HTMLCanvasElement
  ): number => {
    const { top, bottom } = canvas.getBoundingClientRect();
    if (y < top || y > bottom) {
      return undefined;
    } else {
      const heightTiles = coords.height() / coords.width(TILE_DIMENSIONS.SIZE);
      const n = (2 * (bottom - y - top)) / coords.height(); // [0, 1] across canvas
      const nTile = -heightTiles / 2 + n * heightTiles + camera.position.y;
      return Math.round(nTile);
    }
  }
};

export const entityArrayToScreen = {
  x: (x: number, coords: CanvasCoordinates, camera: Camera): number =>
    mapToScreen.x(entityArrayToMap.x(x), coords, camera),
  y: (y: number, coords: CanvasCoordinates, camera: Camera): number =>
    mapToScreen.y(entityArrayToMap.y(y), coords, camera)
};
