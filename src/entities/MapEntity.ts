import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";

export class MapEntity extends Entity {
  position: Position;
  constructor(args: EntityArgs & PositionArgs) {
    super(args);
    this.position = new Position(args.x, args.y);
  }

  render(ctx: CanvasRenderingContext2D) {}
}
