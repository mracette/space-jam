import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";
import { MAP_DIMENSIONS } from "../globals";
import { ENTITY_ARRAY } from "../index";

export type MapEntityArgs = EntityArgs & PositionArgs;

export class MapEntity extends Entity {
  position: Position;
  constructor(args: MapEntityArgs = {}) {
    super(args);
    const { x, y } = args;
    this.position = new Position(x, y);
    ENTITY_ARRAY[this.position.x + (MAP_DIMENSIONS.W - 1) / 2][
      this.position.y + (MAP_DIMENSIONS.H - 1) / 2
    ] = this;
  }
}
