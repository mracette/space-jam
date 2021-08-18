import { Generator, GeneratorArgs } from "./Generator";
import { CanvasCoordinates } from "../../core/Coords";
import { COLORS, DURATIONS, LINE_WIDTH, TAU, TILE_DIMENSIONS } from "../../globals";
import { AUDIO_CTX } from "../../index";
import { mapToScreen } from "../../utils/conversions";
import { rotatePoint } from "../../utils/math";
import { Camera } from "../Camera";

/* eslint-disable-next-line */
export interface CircleGeneratorArgs {}

export class CircleGenerator extends Generator {
  interval: DURATIONS;
  repeatingEvents: number[];
  sequence: number[][];
  radius: number;
  constructor(args: GeneratorArgs & CircleGeneratorArgs = {}) {
    super(args);
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    const cx = mapToScreen.x(this.position.x + 0.5, coords, camera);
    const cy = mapToScreen.y(this.position.y - 0.5, coords, camera);
    ctx.beginPath();
    ctx.arc(cx, cy, coords.width(TILE_DIMENSIONS.SIZE / 2 - LINE_WIDTH.VALUE), 0, TAU);

    ctx.strokeStyle = COLORS.HOT_PINK;
    ctx.fillStyle = COLORS.HOT_PINK;
    ctx.moveTo(cx, cy);

    const cyclePosition = (AUDIO_CTX.currentTime % this.duration) / this.duration;

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
