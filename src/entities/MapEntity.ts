import { Entity, EntityArgs } from "./Entity";
import { Vector2, Vector2Args } from "../core/Vector2";

type MapEntityArgs = EntityArgs & Vector2Args & { preview?: boolean };

export class MapEntity extends Entity {
  position: Vector2;
  preview: boolean;
  constructor(args: MapEntityArgs = {}) {
    super(args);
    const { x, y, preview = false } = args;
    this.preview = preview;
    this.position = new Vector2(x, y);
  }
}
