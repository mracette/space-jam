import { Position } from "../../components/Position";
import { CanvasCoordinates } from "../../core/Coords";
import {
  COLORS,
  DURATIONS,
  ENTITY_STATE,
  LIGHT_UP_DURATION,
  LINE_WIDTH,
  STATS,
  TAU,
  TILE_DIMENSIONS
} from "../../globals";
import { AUDIO_CTX, ENTITY_ARRAY, SCHEDULER } from "../../index";
import { nextSubdivision } from "../../utils/audio";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { rotatePoint } from "../../utils/math";
import { Camera } from "../Camera";
import { MapEntity, MapEntityArgs } from "../MapEntity";

/* eslint-disable-next-line */
interface CircleGenerator1Args {}

export class CircleGenerator1 extends MapEntity {
  interval: DURATIONS;
  repeatingEvents: number[];
  sequence: number[][];
  duration: number;
  nextCycle: number;
  constructor(args: MapEntityArgs & CircleGenerator1Args = {}) {
    super(args);
    this.name = "generator";
    const { x, y } = args;
    this.position = new Position(x, y);
    this.interval = DURATIONS.QUARTER;
    this.repeatingEvents = [];
    this.sequence = [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1]
    ];
    this.duration = this.interval * this.sequence.length;
    this.createRepeatingEvent();
  }

  createRepeatingEvent(): void {
    const entityArrayX = mapToEntityArray.x(this.position.x);
    const entityArrayY = mapToEntityArray.y(this.position.y);
    const nextInterval = nextSubdivision(AUDIO_CTX, this.interval);

    this.sequence.forEach((s, i) => {
      const nextIntervalSequence = nextInterval + i * this.interval;
      if (i === 0) {
        this.nextCycle = nextIntervalSequence;
      }
      return this.repeatingEvents.push(
        SCHEDULER.scheduleRepeating(
          nextIntervalSequence,
          this.interval * this.sequence.length,
          () => {
            const entity = ENTITY_ARRAY[entityArrayX + s[0]][entityArrayY + s[1]];
            if (entity.state !== ENTITY_STATE.PLAYING) {
              entity.state = ENTITY_STATE.PLAYING;
              entity.stateDuration = LIGHT_UP_DURATION.VALUE;
              STATS.notes += entity?.entity?.notes || 0;
            }
          }
        )
      );
    });
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    const cx = mapToScreen.x(this.position.x + 0.5, coords, camera);
    const cy = mapToScreen.y(this.position.y - 0.5, coords, camera);
    ctx.beginPath();
    ctx.arc(cx, cy, coords.width(TILE_DIMENSIONS.SIZE / 2 - LINE_WIDTH.VALUE), 0, TAU);

    ctx.strokeStyle = COLORS.HOT_PINK;
    ctx.fillStyle = COLORS.HOT_PINK;
    ctx.moveTo(cx, cy);
    const durationRemaining = (AUDIO_CTX.currentTime - this.nextCycle) / this.duration;
    const point = rotatePoint(
      cx + coords.width(TILE_DIMENSIONS.SIZE),
      cy,
      cx,
      cy,
      TAU * durationRemaining
    );
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, coords.width(TILE_DIMENSIONS.SIZE / 4), 0, TAU);
    ctx.fill();
    ctx.strokeStyle = COLORS.WHITE;
  }
}
