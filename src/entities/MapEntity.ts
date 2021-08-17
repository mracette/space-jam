import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";
import { Scale, ScaleArgs } from "../components/Scale";
import { ENTITY_ARRAY } from "../index";
import { mapToEntityArray } from "../utils/conversions";

export type MapEntityArgs = EntityArgs & PositionArgs & ScaleArgs;

export class MapEntity extends Entity {
  position: Position;
  scale: Scale;
  constructor(args: MapEntityArgs = {}) {
    super(args);
    const { x, y, scale } = args;
    this.position = new Position(x, y);
    this.scale = new Scale(scale);
    ENTITY_ARRAY[mapToEntityArray.x(this.position.x)][
      mapToEntityArray.y(this.position.y)
    ].entity = this;
  }
}
