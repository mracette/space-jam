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
  nextCycle: number;
  constructor(args: OscillatorArgs) {
    super(args);
    this.name = "oscillator";
    this.repeatingEvents = [];
  }

  createRepeatingEvent(): void {
    const entityArrayX = mapToEntityArray.x(this.position.x);
    const entityArrayY = mapToEntityArray.y(this.position.y);
    const nextInterval = nextSubdivision(this.interval);
    this.sequence.forEach((s, i) => {
      const nextIntervalSequence = nextInterval + i * this.interval;
      return this.repeatingEvents.push(
        SCHEDULER.scheduleRepeating(nextIntervalSequence, this.duration, () => {
          const mapEntity = ENTITY_ARRAY[entityArrayX + s[0]][entityArrayY + s[1]];
          if (mapEntity.entity && mapEntity.state !== ENTITY_STATE.PLAYING) {
            mapEntity.state = ENTITY_STATE.PLAYING;
            mapEntity.stateEndsTime = AUDIO_CTX.currentTime + this.interval;
            STATS.notes += mapEntity?.entity?.notes || 0;
          }
        })
      );
    });
  }
}
