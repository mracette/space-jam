import { Position } from "../components/Position";

export const canMove =
  (self: { position: Position } & unknown) =>
  (x: number, y: number): void => {
    self.position.x += x;
    self.position.y += y;
  };
