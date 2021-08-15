import { Position } from "../components/Position";
import { MAP_DIMENSIONS } from "../globals";
import { clamp } from "../utils/clamp";

export const canMove =
  (self: { position: Position } & unknown) =>
  (x: number, y: number): void => {
    // const newX = clamp(x + self.position.x, MAP_DIMENSIONS.MIN_X, MAP_DIMENSIONS.MIN_X);
    self.position.x += x;
    self.position.y += y;
  };
