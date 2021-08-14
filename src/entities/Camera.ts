import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";
import { Velocity, VelocityArgs } from "../components/Velocity";
import { VIEWPORT_DIMENSIONS } from "../globals";
import { WORLD_MAP } from "../index";
import { canMove } from "../systems/canMove";
import { canMoveSmoothlyWithKeys } from "../systems/canMoveSmoothlyWithKeys";

export class Camera extends Entity {
  position: Position;
  velocity: Velocity;
  move: ReturnType<typeof canMove>;
  moveSmoothlyWithKeys: ReturnType<typeof canMoveSmoothlyWithKeys>;
  constructor({ name = "camera" }: EntityArgs & PositionArgs & VelocityArgs = {}) {
    super({ name });
    this.position = new Position();
    this.velocity = new Velocity();
    this.move = canMove(this);
    this.moveSmoothlyWithKeys = canMoveSmoothlyWithKeys(this, 0.01);
  }

  update(time: number): void {
    this.move(this.velocity.x, this.velocity.y);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const xRound = Math.round(this.position.x);
    const yRound = Math.round(this.position.y);
    const xViewHalf = (VIEWPORT_DIMENSIONS.X - 1) / 2;
    const yViewHalf = (VIEWPORT_DIMENSIONS.Y - 1) / 2;
    for (let i = xRound - xViewHalf; i++; i <= xRound + xViewHalf) {
      for (let j = yRound - yViewHalf; j++; j <= yRound + yViewHalf) {
        ctx.fillRect(i, j, 10, 10);
      }
    }
    ctx.restore();
  }
}
