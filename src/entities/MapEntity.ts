import { Entity, EntityArgs } from "./Entity";
import { Vector2, Vector2Args } from "../core/Vector2";

type MapEntityArgs = EntityArgs & Vector2Args & { preview?: boolean; id?: string };

export class MapEntity extends Entity {
  id: string;
  position: Vector2;
  preview: boolean;
  disabled: boolean;
  constructor(args: MapEntityArgs = {}) {
    super(args);
    const { x, y, preview = false, id = "" } = args;
    this.id = id;
    this.preview = preview;
    this.position = new Vector2(x, y);
  }
}
