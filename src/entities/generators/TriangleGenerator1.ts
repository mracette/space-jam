import { Generator, GeneratorArgs } from "./Generator";
import { CanvasCoordinates } from "../../core/Coords";
import { COLORS, DURATIONS, LINE_WIDTH, TAU, TILE_DIMENSIONS } from "../../globals";
import { AUDIO_CTX } from "../../index";
import { mapToScreen } from "../../utils/conversions";
import { equilateralTriangle } from "../../utils/geometry";
import { lerp } from "../../utils/math";
import { Camera } from "../Camera";

/* eslint-disable-next-line */
interface TriangleGenerator1Args {}

export class TriangleGenerator1 extends Generator {
  constructor(args: GeneratorArgs & TriangleGenerator1Args = {}) {
    super(args);
    this.interval = DURATIONS.QUARTER_TRIPLETS;
    this.sequence = [
      [0, 1],
      [1, -1],
      [-1, -1]
    ];
    this.duration = this.interval * this.sequence.length;
    this.createRepeatingEvent();
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    const cx = mapToScreen.x(this.position.x + 0.5, coords, camera);
    const cy = mapToScreen.y(this.position.y - 0.5, coords, camera);

    equilateralTriangle(
      ctx,
      cx,
      cy,
      coords.width(TILE_DIMENSIONS.SIZE - LINE_WIDTH.VALUE * 2)
    );
    ctx.stroke();

    ctx.strokeStyle = COLORS.HOT_PINK;
    ctx.fillStyle = COLORS.HOT_PINK;
    ctx.moveTo(cx, cy);

    const cyclePosition = (AUDIO_CTX.currentTime % this.duration) / this.duration;

    let px, py;

    for (let i = 0; i < this.sequence.length; i++) {
      const cycleSegment = (i + 1) / this.sequence.length; // 1/3, 2/3, 3/3
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
