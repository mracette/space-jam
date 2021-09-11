import { Oscillator } from "./Oscillator";
import { CANVAS_CONTEXTS } from "../../globals/dom";
import { TAU } from "../../globals/math";
import { LINE_WIDTH, TILE_DIMENSIONS } from "../../globals/sizes";
import { COORDS } from "../../utils/conversions";
import { rotatePoint } from "../../utils/math";

export class CircleOscillator extends Oscillator {
  radius: number;

  constructor(args: ConstructorParameters<typeof Oscillator>[0] = {}) {
    super(args);
  }

  init(): void {
    this.sequence = [
      [0, this.radius],
      [this.radius, 0],
      [0, -this.radius],
      [-this.radius, 0]
    ];
    this.duration = this.interval * this.sequence.length;
    super.init();
  }

  renderBaseShape(
    cx: number,
    cy: number,
    ctx: CanvasRenderingContext2D = CANVAS_CONTEXTS.oscillator,
    circumference: number = COORDS.width(TILE_DIMENSIONS.SIZE - LINE_WIDTH.DOUBLE),
    lineWidth: number = COORDS.width(LINE_WIDTH.VALUE),
    color: string = this.disabled ? this.colorDisabled : this.color
  ): void {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(cx, cy, circumference / 2, 0, TAU);
  }

  renderArm(cx: number, cy: number): void {
    CANVAS_CONTEXTS.oscillator.moveTo(cx, cy);
    const point = rotatePoint(
      cx + COORDS.width(TILE_DIMENSIONS.SIZE * this.radius),
      cy,
      cx,
      cy,
      TAU * this.getCyclePosition() - Math.PI / 2
    );
    CANVAS_CONTEXTS.oscillator.lineTo(point.x, point.y);
    CANVAS_CONTEXTS.oscillator.stroke();
    CANVAS_CONTEXTS.oscillator.beginPath();
    CANVAS_CONTEXTS.oscillator.arc(
      point.x,
      point.y,
      COORDS.width(TILE_DIMENSIONS.QUARTER),
      0,
      TAU
    );
    CANVAS_CONTEXTS.oscillator.fill();
  }
}
