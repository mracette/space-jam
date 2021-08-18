import { Oscillator, OscillatorArgs } from "./Oscillator";
import { CanvasCoordinates } from "../../core/Coords";
import { LINE_WIDTH, TAU, TILE_DIMENSIONS } from "../../globals";
import { AUDIO_CTX } from "../../index";
import { mapToScreen } from "../../utils/conversions";
import { equilateralTriangle } from "../../utils/geometry";
import { lerp } from "../../utils/math";
import { Camera } from "../Camera";

export class SquareOscillator extends Oscillator {
  width: number;
  constructor(args: OscillatorArgs = {}) {
    super(args);
    this.width = 1;
  }

  static renderBaseShape(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    lineWidth: number,
    color: string
  ): void {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeRect(cx - width / 2, cy - width / 2, width, width);
    ctx.stroke();
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    const cx = mapToScreen.x(this.position.x + 0.5, coords, camera);
    const cy = mapToScreen.y(this.position.y - 0.5, coords, camera);

    SquareOscillator.renderBaseShape(
      ctx,
      cx,
      cy,
      coords.width(TILE_DIMENSIONS.SIZE * this.width - LINE_WIDTH.VALUE * 2),
      coords.width(LINE_WIDTH.VALUE),
      this.disabled ? this.colorDisabled : this.color
    );

    ctx.moveTo(cx, cy);

    const cyclePosition = this.getCyclePosition();

    let px, py;

    for (let i = 0; i < this.sequence.length; i++) {
      const cycleSegment = (i + 1) / this.sequence.length;
      if (cyclePosition < cycleSegment) {
        const proportion = (cycleSegment - cyclePosition) * this.sequence.length;
        px = mapToScreen.x(
          this.position.x +
            0.5 +
            lerp(
              this.sequence[i][0],
              this.sequence[(i + 1) % this.sequence.length][0],
              proportion
            ),
          coords,
          camera
        );
        py = mapToScreen.y(
          this.position.y -
            0.5 +
            lerp(
              this.sequence[i][1],
              this.sequence[(i + 1) % this.sequence.length][1],
              proportion
            ),
          coords,
          camera
        );
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, coords.width(TILE_DIMENSIONS.SIZE / 4), 0, TAU);
        ctx.fill();
        break;
      }
    }
  }
}
