import { CanvasCoordinates } from "../core/Coords";
import { Camera } from "../entities/Camera";
import { MAP_DIMENSIONS, TILE_DIMENSIONS } from "../globals";

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
    coords.width(TILE_DIMENSIONS.SIZE / 2), // centers within grid
  y: (y: number, coords: CanvasCoordinates, camera: Camera): number =>
    coords.height(0.5) + // centers in canvas
    (camera.position.y - y) * coords.width(TILE_DIMENSIONS.SIZE) - // scales map position to tile size relative to camera
    coords.width(TILE_DIMENSIONS.SIZE / 2) // centers within grid
};

export const entityArrayToScreen = {
  x: (x: number, coords: CanvasCoordinates, camera: Camera): number =>
    mapToScreen.x(entityArrayToMap.x(x), coords, camera),
  y: (y: number, coords: CanvasCoordinates, camera: Camera): number =>
    mapToScreen.y(entityArrayToMap.y(y), coords, camera)
};
