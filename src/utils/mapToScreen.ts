import { CanvasCoordinates } from "../core/Coords";
import { TILE_DIMENSIONS } from "../globals";

export const mapToScreen = {
  x: (x: number, coords: CanvasCoordinates): number =>
    coords.width(0.5) +
    x * coords.width(TILE_DIMENSIONS.SIZE) -
    coords.width(TILE_DIMENSIONS.SIZE / 2),
  y: (y: number, coords: CanvasCoordinates): number =>
    coords.height(0.5) -
    y * coords.width(TILE_DIMENSIONS.SIZE) -
    coords.width(TILE_DIMENSIONS.SIZE / 2)
};
