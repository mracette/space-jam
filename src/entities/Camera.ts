import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";
import { Velocity, VelocityArgs } from "../components/Velocity";
import { CanvasCoordinates } from "../core/Coords";
import { COLORS, GRADIENT_FOG, TILE_DIMENSIONS, VIEWPORT_DIMENSIONS } from "../globals";
import { WORLD_MAP } from "../index";
import { canMove } from "../systems/canMove";
import { canMoveSmoothlyWithKeys } from "../systems/canMoveSmoothlyWithKeys";
import { mapToScreen } from "../utils/mapToScreen";

const drawEmptyTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
};

export class Camera extends Entity {
  position: Position;
  velocity: Velocity;
  move: ReturnType<typeof canMove>;
  constructor({ name = "camera" }: EntityArgs & PositionArgs & VelocityArgs = {}) {
    super({ name });
    this.position = new Position();
    this.velocity = new Velocity();
    this.move = canMove(this);
    canMoveSmoothlyWithKeys(this, 0.04);
  }

  update(time: number): void {
    this.move(this.velocity.x, this.velocity.y);
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates): void {
    ctx.save();
    ctx.fillStyle = COLORS.background;
    ctx.strokeStyle = "white";
    ctx.lineWidth = coords.width(0.003);
    ctx.fillRect(0, 0, coords.width(), coords.height());
    const xRound = Math.round(this.position.x);
    const yRound = Math.round(this.position.y);
    const xViewHalf = (VIEWPORT_DIMENSIONS.X - 1) / 2;
    const yViewHalf = (VIEWPORT_DIMENSIONS.Y - 1) / 2;
    for (let i = xRound - xViewHalf; i <= xRound + xViewHalf; i++) {
      for (let j = yRound - yViewHalf; j <= yRound + yViewHalf; j++) {
        const xDelta = i - this.position.x;
        const yDelta = j - this.position.y;
        ctx.strokeRect(
          mapToScreen.x(xDelta, coords),
          mapToScreen.y(yDelta, coords),
          coords.width(TILE_DIMENSIONS.SIZE),
          coords.width(TILE_DIMENSIONS.SIZE)
        );
      }
    }
    ctx.fillStyle = GRADIENT_FOG;
    ctx.fillRect(0, 0, coords.width(), coords.height());
    ctx.restore();
  }
}
