import {
  CANVAS_CONTEXTS,
  DURATIONS,
  ENTITY_STATE,
  STATS,
  TAU,
  TILE_DIMENSIONS
} from "../../globals";
import { COLORS } from "../../globals/colors";
import { AUDIO_CTX, CAMERA, COORDS, ENTITY_ARRAY, SCHEDULER } from "../../index";
import { nextSubdivision } from "../../utils/audio";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { lerp } from "../../utils/math";
import { MapEntity } from "../MapEntity";

export class Oscillator extends MapEntity {
  interval: DURATIONS;
  repeatingEvents: number[];
  sequence: number[][];
  duration: number;
  color: string;
  colorDisabled: string;
  disabled: boolean;
  cost: number;

  constructor(args: ConstructorParameters<typeof MapEntity>[0] = {}) {
    super(args);
    this.name = "oscillator";
    this.repeatingEvents = [];
    this.colorDisabled = COLORS.DISABLED;
  }

  init(): void {
    if (!this.preview) {
      this.placeOnMap();
    }
  }

  getCyclePosition(): number {
    return (AUDIO_CTX.currentTime % this.duration) / this.duration;
  }

  fitsInMap(): boolean {
    const { xLower, xUpper, yLower, yUpper } = CAMERA.entityArrayBounds;
    const { x, y } = this.position;
    const arrX = mapToEntityArray.x(x);
    const arrY = mapToEntityArray.y(y);
    const arr = ENTITY_ARRAY[arrX][arrY];
    const isInView = arrX > xLower && arrX < xUpper && arrY > yLower && arrY < yUpper;
    const spaceIsTaken = Boolean(arr.entity);
    const isBlocked = arr.blocked;
    return isInView && !spaceIsTaken && !isBlocked;
  }

  placeOnMap(): void {
    this.preview = false;
    // @ts-ignore
    ENTITY_ARRAY[mapToEntityArray.x(this.position.x)][
      mapToEntityArray.y(this.position.y)
    ].entity = this;
    this.repeatingEvents.forEach((event) => {
      SCHEDULER.cancel(event);
    });
    this.createRepeatingEvents();
  }

  renderArm(cx: number, cy: number): void {
    CANVAS_CONTEXTS.oscillator.moveTo(cx, cy);

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
            )
        );
        py = mapToScreen.y(
          this.position.y -
            0.5 +
            lerp(
              this.sequence[i][1],
              this.sequence[(i + 1) % this.sequence.length][1],
              proportion
            )
        );
        CANVAS_CONTEXTS.oscillator.lineTo(px, py);
        CANVAS_CONTEXTS.oscillator.stroke();
        CANVAS_CONTEXTS.oscillator.beginPath();
        CANVAS_CONTEXTS.oscillator.arc(
          px,
          py,
          COORDS.width(TILE_DIMENSIONS.QUARTER),
          0,
          TAU
        );
        CANVAS_CONTEXTS.oscillator.fill();
        break;
      }
    }
  }

  createRepeatingEvents(): void {
    const entityArrayX = mapToEntityArray.x(this.position.x);
    const entityArrayY = mapToEntityArray.y(this.position.y);
    const cyclePositionIndex = Math.ceil(this.getCyclePosition() * this.sequence.length);
    const nextInterval = nextSubdivision(this.interval);

    for (let i = 0; i < this.sequence.length; i++) {
      const nextIntervalSequence = nextInterval + i * this.interval;
      const sequenceIndex = (i + cyclePositionIndex) % this.sequence.length;
      const sequenceEntry = this.sequence[sequenceIndex];
      const mapEntity =
        ENTITY_ARRAY[entityArrayX + sequenceEntry[0]][entityArrayY + sequenceEntry[1]];
      this.repeatingEvents.push(
        SCHEDULER.scheduleRepeating(nextIntervalSequence, this.duration, () => {
          if (mapEntity.entity && mapEntity.state !== ENTITY_STATE.PLAYING) {
            mapEntity.state = ENTITY_STATE.PLAYING;
            mapEntity.stateEndsTime = AUDIO_CTX.currentTime + DURATIONS.QUARTER * 0.9;
            STATS.notes += mapEntity?.entity?.notes || 0;
          }
        })
      );
    }
  }
}
