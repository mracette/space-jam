import { COLORS } from "../../globals/colors";
import { CANVAS_CONTEXTS } from "../../globals/dom";
import { TAU } from "../../globals/math";
import { TILE_DIMENSIONS } from "../../globals/sizes";
import { CAMERA, COORDS, ENTITY_ARRAY } from "../../index";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import {
  BoundingBox,
  createShapeFromOutline,
  findBoundingBoxFromOutline
} from "../../utils/geometry";
import { MapEntity } from "../MapEntity";
import { Sound } from "../sounds/Sound";

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
  constructor(args: ConstructorParameters<typeof MapEntity>[0]) {
    super(args);
    this.name = "instrument";
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
    const ex = mapToEntityArray.x(this.position.x);
    const ey = mapToEntityArray.y(this.position.y);
    // @ts-ignore
    ENTITY_ARRAY[ex][ey].entity = this;
    this.shape.forEach(([dx, dy]) => {
      ENTITY_ARRAY[ex + dx][ey + dy].blocked = true;
    });
  }

  removeFromMap(): void {
    const ex = mapToEntityArray.x(this.position.x);
    const ey = mapToEntityArray.y(this.position.y);
    // @ts-ignore
    ENTITY_ARRAY[ex][ey] = new Object();
    this.shape.forEach(([dx, dy]) => {
      ENTITY_ARRAY[ex + dx][ey + dy].blocked = false;
    });
  }

  render(
    ctx: CanvasRenderingContext2D = CANVAS_CONTEXTS.instrument,
    showLabel = true
  ): void {
    ctx.save();
    ctx.fillStyle = this.disabled ? COLORS.DISABLED : this.color;
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
    ctx.fillRect(
      mapToScreen.x(this.position.x - (this.boundingBoxWidth - 1) / 2),
      mapToScreen.y(this.position.y + (this.boundingBoxHeight - 1) / 2),
      COORDS.width(TILE_DIMENSIONS.SIZE) * this.boundingBoxWidth,
      COORDS.width(TILE_DIMENSIONS.SIZE) * this.boundingBoxHeight
    );
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
        this.display.substr(0, 1),
        cx,
        cy + metrics.actualBoundingBoxAscent / 2
      );
    }

    ctx.restore();
  }
}
