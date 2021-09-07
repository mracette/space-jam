import { Entity, EntityArgs } from "./Entity";
import { Instrument } from "./instruments/Instrument";
import { Oscillator } from "./oscillators/Oscillator";
import { CanvasCoordinates } from "../core/Coords";
import { Vector2, Vector2Args } from "../core/Vector2";
import { CANVAS_CONTEXTS } from "../globals/dom";
import { EntityArrayElement, ENTITY_ARRAY, ENTITY_STATE } from "../globals/game";
import { ENTITY_ARRAY_DIMENSIONS, VIEWPORT_DIMENSIONS } from "../globals/sizes";
import { entityArrayToMap, mapToEntityArray, mapToScreen } from "../utils/conversions";
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
  velocity: Vector2;
  coords: CanvasCoordinates;
  previewEntity: Instrument | Oscillator;
  inspectEntity: Instrument | Oscillator;
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

  constructor({ type = "camera", coords }: EntityArgs & CameraArgs & Vector2Args) {
    super({ type });
    this.coords = coords;
    this.position = new Vector2();
    this.velocity = new Vector2();
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
    this.entityArrayBounds = {
      xLower: Math.max(
        ENTITY_ARRAY_DIMENSIONS.MIN_X,
        mapToEntityArray.x(xRound - VIEWPORT_DIMENSIONS.W_HALF)
      ),
      xUpper: Math.min(
        ENTITY_ARRAY_DIMENSIONS.MAX_X,
        mapToEntityArray.x(xRound + VIEWPORT_DIMENSIONS.W_HALF)
      ),
      yLower: Math.max(
        ENTITY_ARRAY_DIMENSIONS.MIN_Y,
        mapToEntityArray.y(yRound - VIEWPORT_DIMENSIONS.H_HALF)
      ),
      yUpper: Math.min(
        ENTITY_ARRAY_DIMENSIONS.MAX_Y,
        mapToEntityArray.y(yRound + VIEWPORT_DIMENSIONS.H_HALF)
      )
    };
  }

  updateViewport(): void {
    this.updateEntityArrayBounds();
    drawTiles();
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
      const { entity, state } = mapEntity;
      if (entity?.type === "instrument") {
        // draw the increase
        if (state === ENTITY_STATE.PLAYING) {
          drawNoteIncrease(
            CANVAS_CONTEXTS.stats,
            this.coords,
            mapToScreen.x(entityArrayToMap.x(i) + 0.5),
            mapToScreen.y(entityArrayToMap.y(j) - 0.5),
            (entity as Instrument).notes
          );
        }
      }
    });

    drawOscillators();
    drawInstruments();

    // render the preview entity if applicable
    this.previewEntity?.render();
  }
}
