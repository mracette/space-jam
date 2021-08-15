import { Camera } from "./Camera";
import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";
import { CanvasCoordinates } from "../core/Coords";
import { MAP_DIMENSIONS } from "../globals";
import { ENTITY_ARRAY } from "../index";
import { mapToEntityArray } from "../utils/conversions";

export type MapEntityArgs = EntityArgs & PositionArgs;

export class MapEntity extends Entity {
  position: Position;
  constructor(args: MapEntityArgs = {}) {
    super(args);
    const { x, y } = args;
    this.position = new Position(x, y);
    ENTITY_ARRAY[mapToEntityArray.x(this.position.x)][
      mapToEntityArray.y(this.position.y)
    ].entity = this;
  }
}
