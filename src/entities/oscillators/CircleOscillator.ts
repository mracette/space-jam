import { Oscillator, OscillatorArgs } from "./Oscillator";
import { CanvasCoordinates } from "../../core/Coords";
import { COLORS, LINE_WIDTH, TAU, TILE_DIMENSIONS } from "../../globals";
import { mapToScreen } from "../../utils/conversions";
import { rotatePoint } from "../../utils/math";
import { Camera } from "../Camera";

/* eslint-disable-next-line */
export interface CircleOscillatorArgs {}

export class CircleOscillator extends Oscillator {
  radius: number;

  constructor(args: OscillatorArgs & CircleOscillatorArgs = {}) {
    super(args);
    this.colorDisabled = COLORS.DISABLED;
    this.radius = 1;
  }

  static renderBaseShape(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    lineWidth: number,
    color: string
  ): void {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    const cx = mapToScreen.x(this.position.x + 0.5, coords, camera);
    const cy = mapToScreen.y(this.position.y - 0.5, coords, camera);

    CircleOscillator.renderBaseShape(
      ctx,
      cx,
      cy,
      coords.width(TILE_DIMENSIONS.HALF - LINE_WIDTH.VALUE),
      coords.width(LINE_WIDTH.VALUE),
      this.disabled ? this.colorDisabled : this.color
    );

    ctx.moveTo(cx, cy);

    const cyclePosition = this.getCyclePosition();

    const point = rotatePoint(
      cx + coords.width(TILE_DIMENSIONS.SIZE * this.radius),
      cy,
      cx,
      cy,
      TAU * cyclePosition - Math.PI / 2
    );
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, coords.width(TILE_DIMENSIONS.SIZE / 4), 0, TAU);
    ctx.fill();
  }
}
