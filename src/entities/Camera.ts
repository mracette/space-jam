import { Entity, EntityArgs } from "./Entity";
import { OSCILLATOR_DEFINITIONS } from "./oscillators/definitions";
import { CanvasCoordinates } from "../core/Coords";
import { Vector2, Vector2Args } from "../core/Vector2";
import {
  COLORS,
  TILE_DIMENSIONS,
  VIEWPORT_DIMENSIONS,
  ENTITY_ARRAY_DIMENSIONS,
  TAU,
  LINE_WIDTH,
  ENTITY_STATE,
  CANVAS_CONTEXTS,
  ELEMENTS,
  STATS
} from "../globals";
import { AUDIO_CTX, COORDS, EntityArrayElement, ENTITY_ARRAY } from "../index";
import { clearCanvasAndState } from "../utils/canvas";
import { rgbWithAlpha } from "../utils/colors";
import { entityArrayToScreen, mapToEntityArray } from "../utils/conversions";
import { MENU_VISIBLE } from "../utils/dom";

const drawTile = (
  coords: CanvasCoordinates,
  cx: number,
  cy: number,
  fill = false,
  stroke = true
) => {
  stroke &&
    CANVAS_CONTEXTS.tiles.strokeRect(
      cx,
      cy,
      coords.width(TILE_DIMENSIONS.SIZE),
      coords.width(TILE_DIMENSIONS.SIZE)
    );

  fill &&
    CANVAS_CONTEXTS.tiles.fillRect(
      cx,
      cy,
      coords.width(TILE_DIMENSIONS.SIZE),
      coords.width(TILE_DIMENSIONS.SIZE)
    );
};

const drawNoteIncrease = (
  ctx: CanvasRenderingContext2D,
  coords: CanvasCoordinates,
  cx: number,
  cy: number,
  amount: number
) => {
  const fontSize = coords.width(0.035);
  const tileSize = coords.width(TILE_DIMENSIONS.SIZE);
  ctx.fillStyle = rgbWithAlpha(...COLORS.BACKGROUND_RGB, 0.5);
  ctx.beginPath();
  ctx.arc(cx + tileSize / 2, cy + tileSize / 2, tileSize / 2, 0, TAU);
  ctx.fill();
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = COLORS.WHITE;
  const text = "+" + amount;
  ctx.fillText(text, cx, cy + fontSize);
};

interface CameraArgs {
  coords: CanvasCoordinates;
}

export class Camera extends Entity {
  position: Vector2;
  coords: CanvasCoordinates;
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
    // updates the camera's position
    this.position.x -= x;
    this.position.y += y;

    // updates the array indices considered to be in the camera's view
    this.updateEntityArrayBounds();

    // reset state and canvas
    clearCanvasAndState(ELEMENTS.canvasTiles);
    CANVAS_CONTEXTS.tiles.fillStyle = COLORS.BACKGROUND;
    CANVAS_CONTEXTS.tiles.strokeStyle = COLORS.WHITE;
    CANVAS_CONTEXTS.tiles.lineWidth = this.coords.width(LINE_WIDTH.VALUE);
    CANVAS_CONTEXTS.tiles.fillRect(0, 0, this.coords.width(), this.coords.height());

    // redraw tiles
    this.applyToEntityArray((_, i, j) => {
      drawTile(this.coords, entityArrayToScreen.x(i), entityArrayToScreen.y(j));
    });
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
    // stats loop
    clearCanvasAndState(ELEMENTS.canvasStats);

    // draw overall game stats
    CANVAS_CONTEXTS.stats.font = `${COORDS.width(0.035)}px sans-serif`;
    CANVAS_CONTEXTS.stats.fillStyle = COLORS.WHITE;
    const text = "Notes: " + STATS.notes;
    CANVAS_CONTEXTS.stats.fillText(text, COORDS.nx(-0.95), COORDS.ny(-0.95));

    // draw map stats
    this.applyToEntityArray((mapEntity, i, j) => {
      const { stateEndsTime, entity, state } = mapEntity;
      if (entity?.name === "instrument") {
        if (stateEndsTime > AUDIO_CTX.currentTime && state === ENTITY_STATE.PLAYING) {
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

    // instruments loop
    clearCanvasAndState(ELEMENTS.canvasInstruments);
    CANVAS_CONTEXTS.instrument.fillStyle = COLORS.BACKGROUND;
    this.applyToEntityArray(({ entity }) => {
      if (entity?.name === "instrument") {
        entity?.render(CANVAS_CONTEXTS.instrument, this.coords, this);
      }
    });

    // oscillators loop
    clearCanvasAndState(ELEMENTS.canvasOscillators);
    CANVAS_CONTEXTS.oscillator.lineCap = "round";
    CANVAS_CONTEXTS.oscillator.lineJoin = "round";
    CANVAS_CONTEXTS.oscillator.lineWidth = this.coords.width(LINE_WIDTH.VALUE);
    this.applyToEntityArray(({ entity }) => {
      if (entity?.name === "oscillator") {
        entity?.render(CANVAS_CONTEXTS.oscillator, this.coords, this);
      }
    });
  }
}
