import { COLORS } from "../../globals/colors";
import { CANVAS_CONTEXTS } from "../../globals/dom";
import { CAMERA, ENTITY_ARRAY } from "../../globals/game";
import { TAU } from "../../globals/math";
import { TILE_DIMENSIONS } from "../../globals/sizes";
import { Sound } from "../../sounds/Sound";
import { updateSpatialEffects } from "../../utils/audio";
import { COORDS, mapToEntityArray, mapToScreen } from "../../utils/conversions";
import {
  BoundingBox,
  createShapeFromOutline,
  findBoundingBoxFromOutline
} from "../../utils/geometry";
import { MapEntity } from "../MapEntity";
import { AnyOscillator } from "../oscillators/factories";

type InstrumentType =
  | "dr" // drums
  | "bs" // basic synths
  | "cs"; // complex synths

export class Instrument extends MapEntity {
  notes: number;
  shape: number[][];
  outline: number[][];
  hueRange: number[];
  entityClass: any;
  boundingBox: BoundingBox;
  boundingBoxWidth: number;
  boundingBoxHeight: number;
  sound: Sound;
  instrumentType: InstrumentType;
  constructor(args: ConstructorParameters<typeof MapEntity>[0]) {
    super(args);
    this.type = "instrument";
    this.color = COLORS.HOT_GREEN;
  }

  init(): void {
    this.boundingBox = findBoundingBoxFromOutline(this.outline);
    this.shape = createShapeFromOutline(
      CANVAS_CONTEXTS.instrument,
      this.outline,
      this.boundingBox
    );
    this.boundingBoxWidth = this.boundingBox.maxX - this.boundingBox.minX;
    this.boundingBoxHeight = this.boundingBox.maxY - this.boundingBox.minY;
    if (!this.preview) {
      this.placeOnMap();
    }
    this.sell = Math.round(this.cost / 3);
    updateSpatialEffects(this);
  }

  fitsInMap(): boolean {
    const { xLower, xUpper, yLower, yUpper } = CAMERA.entityArrayBounds;
    const { x, y } = this.position;
    const arrX = mapToEntityArray.x(x);
    const arrY = mapToEntityArray.y(y);
    const arrayEntity = ENTITY_ARRAY[arrX][arrY];
    const isInView = arrX > xLower && arrX < xUpper && arrY > yLower && arrY < yUpper;
    const spaceIsTaken = Boolean(arrayEntity.entity);
    const isBlocked = arrayEntity.blocked || false;
    const adjacentSpacesAreBlocked = this.shape.some(
      ([sx, sy]) =>
        ENTITY_ARRAY[arrX + sx][arrY + sy].blocked ||
        false ||
        Boolean(ENTITY_ARRAY[arrX + sx][arrY + sy].entity)
    );
    return isInView && !spaceIsTaken && !isBlocked && !adjacentSpacesAreBlocked;
  }

  placeOnMap(): void {
    this.preview = false;
    const arrX = mapToEntityArray.x(this.position.x);
    const arrY = mapToEntityArray.y(this.position.y);
    // @ts-ignore
    ENTITY_ARRAY[arrX][arrY].entity = this;
    this.shape.forEach(([dx, dy]) => {
      ENTITY_ARRAY[arrX + dx][arrY + dy].blocked = true;
    });
  }

  removeFromMap(): void {
    const arrX = mapToEntityArray.x(this.position.x);
    const arrY = mapToEntityArray.y(this.position.y);
    // @ts-ignore
    ENTITY_ARRAY[arrX][arrY] = new Object();
    this.shape.forEach(([dx, dy]) => {
      ENTITY_ARRAY[arrX + dx][arrY + dy].blocked = false;
    });
    // this should be changed if any oscillator radius ever goes above 1
    const affectedRadius = 1;
    for (let i = arrX - affectedRadius; i <= arrX + affectedRadius; i++) {
      for (let j = arrY - affectedRadius; j <= arrY + affectedRadius; j++) {
        const affectedEntity = ENTITY_ARRAY[i][j];
        if (affectedEntity?.entity?.type === "oscillator") {
          const affectedOscillator = affectedEntity.entity as AnyOscillator;
          affectedOscillator.createAudioEvents();
        }
      }
    }
  }

  render(
    ctx: CanvasRenderingContext2D = CANVAS_CONTEXTS.instrument,
    showLabel = true
  ): void {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < this.outline.length; i++) {
      const [x, y] = this.outline[i];
      const sx = mapToScreen.x(this.position.x + x);
      const sy = mapToScreen.y(this.position.y + y);
      if (i === 0) {
        ctx.moveTo(sx, sy);
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.closePath();
    ctx.clip();
    // will need more work
    const { minX, maxY } = this.boundingBox;
    const height = COORDS.width(TILE_DIMENSIONS.SIZE) * this.boundingBoxHeight;
    const width = COORDS.width(TILE_DIMENSIONS.SIZE) * this.boundingBoxWidth;
    const sx = mapToScreen.x(this.position.x + minX);
    const sy = mapToScreen.y(this.position.y + maxY);
    const gradient = ctx.createLinearGradient(sx, sy, sx + width, sy + height);
    gradient.addColorStop(0, COLORS.HOT_GREEN);
    gradient.addColorStop(1, COLORS.HOT_BLUE);
    ctx.fillStyle = this.disabled ? COLORS.DISABLED : gradient;
    ctx.fillRect(sx, sy, width, height);
    ctx.stroke();

    if (showLabel) {
      const cx = mapToScreen.x(this.position.x + 0.5);
      const cy = mapToScreen.y(this.position.y - 0.5);
      ctx.fillStyle = COLORS.WHITE;
      ctx.beginPath();
      ctx.arc(cx, cy, COORDS.width(TILE_DIMENSIONS.QUARTER), 0, TAU);
      ctx.fill();
      ctx.fillStyle = COLORS.BACKGROUND;

      const label = this.display.substr(0, 1);
      const metrics = ctx.measureText(label);
      ctx.fillText(
        this.display.substr(0, 2),
        cx,
        cy + metrics.actualBoundingBoxAscent / 2
      );
    }

    ctx.restore();
  }
}
