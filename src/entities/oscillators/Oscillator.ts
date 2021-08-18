import { DURATIONS, ENTITY_STATE, STATS } from "../../globals";
import { AUDIO_CTX, ENTITY_ARRAY, SCHEDULER } from "../../index";
import { nextSubdivision } from "../../utils/audio";
import { mapToEntityArray } from "../../utils/conversions";
import { MapEntity, MapEntityArgs } from "../MapEntity";

export type OscillatorArgs = MapEntityArgs;

export class Oscillator extends MapEntity {
  interval: DURATIONS;
  repeatingEvents: number[];
  sequence: number[][];
  duration: number;
  color: string;
  colorDisabled: string;
  disabled: boolean;

  constructor(args: OscillatorArgs) {
    super(args);
    this.name = "oscillator";
    this.repeatingEvents = [];
  }

  static fitsInMap(x: number, y: number): boolean {
    return !ENTITY_ARRAY[mapToEntityArray.x(x)][mapToEntityArray.y(y)].entity;
  }

  getCyclePosition(): number {
    return (AUDIO_CTX.currentTime % this.duration) / this.duration;
  }

  move(x: number, y: number): void {
    this.repeatingEvents.forEach((event) => {
      SCHEDULER.cancel(event);
    });
    this.position.x = x;
    this.position.y = y;
    ENTITY_ARRAY[mapToEntityArray.x(x)][mapToEntityArray.y(y)].entity = this;
    this.createRepeatingEvent();
  }

  createRepeatingEvent(): void {
    const entityArrayX = mapToEntityArray.x(this.position.x);
    const entityArrayY = mapToEntityArray.y(this.position.y);
    const cyclePositionIndex = Math.ceil(this.getCyclePosition() * this.sequence.length);
    const nextInterval = nextSubdivision(this.interval);
    for (let i = 0; i < this.sequence.length; i++) {
      const nextIntervalSequence = nextInterval + i * this.interval;
      const sequenceIndex = (i + cyclePositionIndex) % this.sequence.length;
      const sequenceEntry = this.sequence[sequenceIndex];
      console.log(
        i,
        sequenceIndex,
        nextIntervalSequence,
        nextInterval,
        this.sequence[sequenceIndex]
      );
      const mapEntity =
        ENTITY_ARRAY[entityArrayX + sequenceEntry[0]][entityArrayY + sequenceEntry[1]];
      this.repeatingEvents.push(
        SCHEDULER.scheduleRepeating(nextIntervalSequence, this.duration, () => {
          if (mapEntity.entity && mapEntity.state !== ENTITY_STATE.PLAYING) {
            mapEntity.state = ENTITY_STATE.PLAYING;
            mapEntity.stateEndsTime = AUDIO_CTX.currentTime + this.interval;
            STATS.notes += mapEntity?.entity?.notes || 0;
          }
        })
      );
    }
  }
}
