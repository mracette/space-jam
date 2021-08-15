import { Position } from "../../components/Position";
import Scheduler from "../../core/AudioScheduler";
import { CanvasCoordinates } from "../../core/Coords";
import {
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
import { Camera } from "../Camera";
import { MapEntity, MapEntityArgs } from "../MapEntity";

/* eslint-disable-next-line */
interface CircleGeneratorArgs {}

export class CircleGenerator extends MapEntity {
  interval: DURATIONS;
  repeatingEvents: number[];
  sequence: number[][];
  constructor(args: MapEntityArgs & CircleGeneratorArgs = {}) {
    super(args);
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
    this.createRepeatingEvent();
  }

  createRepeatingEvent(): void {
    const entityArrayX = mapToEntityArray.x(this.position.x);
    const entityArrayY = mapToEntityArray.y(this.position.y);
    const nextInterval = nextSubdivision(AUDIO_CTX, this.interval);

    this.sequence.forEach((s, i) =>
      this.repeatingEvents.push(
        SCHEDULER.scheduleRepeating(
          nextInterval + i * this.interval,
          this.interval * this.sequence.length,
          () => {
            const entity = ENTITY_ARRAY[entityArrayX + s[0]][entityArrayY + s[1]];
            entity.state = ENTITY_STATE.PLAYING;
            entity.stateDuration = LIGHT_UP_DURATION.VALUE;
            STATS.notes += entity?.entity?.notes || 0;
          }
        )
      )
    );
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    ctx.beginPath();
    ctx.arc(
      mapToScreen.x(this.position.x + 0.5, coords, camera),
      mapToScreen.y(this.position.y - 0.5, coords, camera),
      coords.width(TILE_DIMENSIONS.SIZE / 2 - LINE_WIDTH.VALUE),
      0,
      TAU
    );
    ctx.stroke();
  }
}
