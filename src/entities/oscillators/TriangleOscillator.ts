import { Oscillator } from "./Oscillator";
import { CANVAS_CONTEXTS } from "../../globals/dom";
import { LINE_WIDTH, TILE_DIMENSIONS } from "../../globals/sizes";
import { COORDS } from "../../utils/conversions";
import { equilateralTriangle } from "../../utils/geometry";

export class TriangleOscillator extends Oscillator {
  width: number;
  constructor(args: ConstructorParameters<typeof Oscillator>[0] = {}) {
    super(args);
    this.width = 1;
  }

  renderBaseShape(
    cx: number,
    cy: number,
    ctx: CanvasRenderingContext2D = CANVAS_CONTEXTS.oscillator,
    width: number = COORDS.width(TILE_DIMENSIONS.SIZE * this.width - LINE_WIDTH.DOUBLE),
    lineWidth: number = COORDS.width(LINE_WIDTH.VALUE),
    color: string = this.disabled ? this.colorDisabled : this.color
  ): void {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    equilateralTriangle(ctx, cx, cy, width);
    ctx.stroke();
  }
}
