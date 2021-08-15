import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";
import { Velocity, VelocityArgs } from "../components/Velocity";
import { CanvasCoordinates } from "../core/Coords";
import {
  COLORS,
  GRADIENT_FOG,
  TILE_DIMENSIONS,
  VIEWPORT_DIMENSIONS,
  ENTITY_ARRAY_DIMENSIONS
} from "../globals";
import { ENTITY_ARRAY } from "../index";
import { canMove } from "../systems/canMove";
import { canMoveSmoothlyWithKeys } from "../systems/canMoveSmoothlyWithKeys";
import { entityArrayToScreen, mapToEntityArray } from "../utils/conversions";

export class Camera extends Entity {
  position: Position;
  velocity: Velocity;
  move: ReturnType<typeof canMove>;
  constructor({ name = "camera" }: EntityArgs & PositionArgs & VelocityArgs = {}) {
    super({ name });
    this.position = new Position();
    this.velocity = new Velocity();
    this.move = canMove(this);
    canMoveSmoothlyWithKeys(this, 0.1);
  }

  update(time: number): void {
    this.move(this.velocity.x, this.velocity.y);
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates): void {
    ctx.save();
    ctx.fillStyle = COLORS.background;
    ctx.strokeStyle = "white";
    ctx.lineWidth = coords.width(0.006);
    ctx.fillRect(0, 0, coords.width(), coords.height());

    const xRound = Math.round(this.position.x);
    const yRound = Math.round(this.position.y);

    const xEntityArrayLower = Math.max(
      ENTITY_ARRAY_DIMENSIONS.MIN_X,
      mapToEntityArray.x(xRound - VIEWPORT_DIMENSIONS.W_HALF)
    );
    const xEntityArrayUpper = Math.min(
      ENTITY_ARRAY_DIMENSIONS.MAX_X,
      mapToEntityArray.x(xRound + VIEWPORT_DIMENSIONS.W_HALF)
    );
    const yEntityArrayLower = Math.max(
      ENTITY_ARRAY_DIMENSIONS.MIN_Y,
      mapToEntityArray.y(yRound - VIEWPORT_DIMENSIONS.H_HALF)
    );
    const yEntityArrayUpper = Math.min(
      ENTITY_ARRAY_DIMENSIONS.MAX_Y,
      mapToEntityArray.y(yRound + VIEWPORT_DIMENSIONS.H_HALF)
    );

    for (let i = xEntityArrayLower; i <= xEntityArrayUpper; i++) {
      for (let j = yEntityArrayLower; j <= yEntityArrayUpper; j++) {
        ctx.strokeRect(
          entityArrayToScreen.x(i, coords, this),
          entityArrayToScreen.y(j, coords, this),
          coords.width(TILE_DIMENSIONS.SIZE),
          coords.width(TILE_DIMENSIONS.SIZE)
        );
        ENTITY_ARRAY[i][j]?.render(ctx, coords, this);
      }
    }

    // ctx.fillStyle = GRADIENT_FOG;
    // ctx.fillRect(0, 0, coords.width(), coords.height());
    ctx.restore();
  }
}
