import { Entity, EntityArgs } from "./Entity";
import { INSTRUMENT_ENTITIES } from "./instruments/entities";
import { OSCILLATOR_DEFINITIONS } from "./oscillators/definitions";
import { CanvasCoordinates } from "../core/Coords";
import { Vector2, Vector2Args } from "../core/Vector2";
import {
  VIEWPORT_DIMENSIONS,
  ENTITY_ARRAY_DIMENSIONS,
  ENTITY_STATE,
  CANVAS_CONTEXTS,
  STATS
} from "../globals";
import { AUDIO_CTX, EntityArrayElement, ENTITY_ARRAY } from "../index";
import { entityArrayToScreen, mapToEntityArray } from "../utils/conversions";
import { MENU_VISIBLE } from "../utils/dom";
import {
  drawGameStats,
  drawInstruments,
  drawNoteIncrease,
  drawOscillators,
  drawTiles
} from "../utils/drawing";

interface CameraArgs {
  coords: CanvasCoordinates;
}

export class Camera extends Entity {
  position: Vector2;
  coords: CanvasCoordinates;
  previewEntity:
    | typeof OSCILLATOR_DEFINITIONS[number]
    | typeof INSTRUMENT_ENTITIES[number];
  /**
   * contains the upper/lower bounds of the entity array elements
   * that are currently in the camera's viewport
   */
  entityArrayBounds: {
    xLower: number;
    xUpper: number;
    yLower: number;
    yUpper: number;
  };

  constructor({ name = "camera", coords }: EntityArgs & CameraArgs & Vector2Args) {
    super({ name });
    this.coords = coords;
    this.position = new Vector2();
    this.entityArrayBounds = {
      xLower: undefined,
      xUpper: undefined,
      yLower: undefined,
      yUpper: undefined
    };
    this.updateEntityArrayBounds();
  }

  /**
   * Updates the array indices considered to be in the camera's view.
   */
  updateEntityArrayBounds(): void {
    const xRound = Math.round(this.position.x);
    const yRound = Math.round(this.position.y);
    this.entityArrayBounds.xLower = Math.max(
      ENTITY_ARRAY_DIMENSIONS.MIN_X,
      mapToEntityArray.x(xRound - VIEWPORT_DIMENSIONS.W_HALF)
    );
    this.entityArrayBounds.xUpper = Math.min(
      ENTITY_ARRAY_DIMENSIONS.MAX_X,
      mapToEntityArray.x(xRound + VIEWPORT_DIMENSIONS.W_HALF)
    );
    this.entityArrayBounds.yLower = Math.max(
      ENTITY_ARRAY_DIMENSIONS.MIN_Y,
      mapToEntityArray.y(yRound - VIEWPORT_DIMENSIONS.H_HALF)
    );
    this.entityArrayBounds.yUpper = Math.min(
      ENTITY_ARRAY_DIMENSIONS.MAX_Y,
      mapToEntityArray.y(yRound + VIEWPORT_DIMENSIONS.H_HALF)
    );
  }

  move(x: number, y: number): void {
    this.position.x -= x;
    this.position.y += y;
    this.updateEntityArrayBounds();
    drawTiles();
    drawInstruments();
  }

  applyToEntityArray(
    callback: (entity: EntityArrayElement, i: number, j: number) => void
  ): void {
    for (let i = this.entityArrayBounds.xLower; i <= this.entityArrayBounds.xUpper; i++) {
      for (
        let j = this.entityArrayBounds.yLower;
        j <= this.entityArrayBounds.yUpper;
        j++
      ) {
        callback(ENTITY_ARRAY[i][j], i, j);
      }
    }
  }

  render(): void {
    drawGameStats();
    this.applyToEntityArray((mapEntity, i, j) => {
      const { stateEndsTime, entity, state } = mapEntity;
      if (entity?.name === "instrument") {
        // if true, a note is played
        if (stateEndsTime > AUDIO_CTX.currentTime && state === ENTITY_STATE.PLAYING) {
          // draw the increase
          drawNoteIncrease(
            CANVAS_CONTEXTS.stats,
            this.coords,
            entityArrayToScreen.x(i),
            entityArrayToScreen.y(j),
            entity.notes
          );

          // update enabled / disabled based on cost and available notes
          if (MENU_VISIBLE) {
            OSCILLATOR_DEFINITIONS.forEach((oscillator) => {
              const button = document.getElementById(oscillator.id) as HTMLButtonElement;
              if (oscillator.cost < STATS.notes) {
                button.disabled = false;
              } else {
                button.disabled = true;
              }
            });
          }
        }

        // change state if stateEndsTime has elapsed
        if (stateEndsTime <= AUDIO_CTX.currentTime && state === ENTITY_STATE.PLAYING) {
          mapEntity.state = ENTITY_STATE.STOPPED;
        }
      }
    });

    drawOscillators();

    // render the preview entity if applicable
    this.previewEntity?.render();
  }
}
