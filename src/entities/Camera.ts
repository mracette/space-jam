import { Entity, EntityArgs } from "./Entity";
import { Position, PositionArgs } from "../components/Position";
import { Velocity, VelocityArgs } from "../components/Velocity";
import { CanvasCoordinates } from "../core/Coords";
import {
  COLORS,
  GRADIENT_FOG,
  TILE_DIMENSIONS,
  VIEWPORT_DIMENSIONS,
  ENTITY_ARRAY_DIMENSIONS,
  TAU,
  MOUSE_POSITION
} from "../globals";
import { ENTITY_ARRAY } from "../index";
import { entityArrayToScreen, mapToEntityArray } from "../utils/conversions";

const drawEmptyTile = (
  ctx: CanvasRenderingContext2D,
  coords: CanvasCoordinates,
  cx: number,
  cy: number,
  isSelected: boolean
) => {
  if (isSelected) {
    ctx.fillStyle = COLORS.mainGreen;
    ctx.fillRect(
      cx,
      cy,
      coords.width(TILE_DIMENSIONS.SIZE),
      coords.width(TILE_DIMENSIONS.SIZE)
    );
  }
  ctx.strokeRect(
    cx,
    cy,
    coords.width(TILE_DIMENSIONS.SIZE),
    coords.width(TILE_DIMENSIONS.SIZE)
  );
};

export class Camera extends Entity {
  position: Position;
  velocity: Velocity;

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

  constructor({ name = "camera" }: EntityArgs & PositionArgs & VelocityArgs = {}) {
    super({ name });
    this.position = new Position();
    this.velocity = new Velocity();
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

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates): void {
    ctx.fillStyle = COLORS.background;
    ctx.strokeStyle = "white";
    ctx.lineWidth = coords.width(0.006);
    ctx.fillRect(0, 0, coords.width(), coords.height());

    for (let i = this.entityArrayBounds.xLower; i <= this.entityArrayBounds.xUpper; i++) {
      for (
        let j = this.entityArrayBounds.yLower;
        j <= this.entityArrayBounds.yUpper;
        j++
      ) {
        drawEmptyTile(
          ctx,
          coords,
          entityArrayToScreen.x(i, coords, this),
          entityArrayToScreen.y(j, coords, this),
          mapToEntityArray.x(MOUSE_POSITION.mapX) === i &&
            mapToEntityArray.y(MOUSE_POSITION.mapY) === j
        );
        const entity = ENTITY_ARRAY[i][j];
        if (entity) {
          entity?.render(ctx, coords, this);
        }
      }
    }

    ctx.fillStyle = GRADIENT_FOG;
    ctx.fillRect(0, 0, coords.width(), coords.height());
    ctx.arc(
      coords.nx(0),
      coords.ny(0),
      coords.width(TILE_DIMENSIONS.SIZE * VIEWPORT_DIMENSIONS.W_HALF),
      0,
      TAU
    );
    ctx.stroke();
  }
}
