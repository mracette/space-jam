import { CacheItem, INSTRUMENT_CACHE } from "./cache";
import { COLORS } from "../../globals/colors";
import { CANVAS_CONTEXTS, ELEMENTS } from "../../globals/dom";
import { TAU } from "../../globals/math";
import { LINE_WIDTH, TILE_DIMENSIONS } from "../../globals/sizes";
import { CAMERA, COORDS, ENTITY_ARRAY } from "../../index";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { drawInstrumentPattern } from "../../utils/drawing";
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
  cache: CacheItem;
  sound: Sound;
  constructor(args: ConstructorParameters<typeof MapEntity>[0]) {
    super(args);
    this.name = "instrument";
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`; // COLORS.HOT_GREEN;
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
    this.cache = INSTRUMENT_CACHE.find(({ id }) => id === this.id);
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
    const arr = ENTITY_ARRAY[arrX][arrY];
    const isInView = arrX > xLower && arrX < xUpper && arrY > yLower && arrY < yUpper;
    const spaceIsTaken = Boolean(arr.entity);
    const isBlocked = arr.blocked || false;
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

  renderBaseShape(
    sx: number = mapToScreen.x(this.position.x - (this.boundingBoxWidth - 1) / 2),
    sy: number = mapToScreen.y(this.position.y + (this.boundingBoxHeight - 1) / 2),
    ctx: CanvasRenderingContext2D = CANVAS_CONTEXTS.instrument,
    baseWidth: number = COORDS.width(TILE_DIMENSIONS.SIZE),
    lineWidth: number = COORDS.width(LINE_WIDTH.VALUE),
    color: string = this.disabled ? this.colorDisabled : this.color
  ): void {
    ctx.fillStyle = color;
    ctx.fillRect(
      sx,
      sy,
      baseWidth * this.boundingBoxWidth,
      baseWidth * this.boundingBoxHeight
    );
  }

  render(ctx: CanvasRenderingContext2D = CANVAS_CONTEXTS.instrument): void {
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
    ctx.stroke();
    ctx.clip();

    this.renderBaseShape();

    ctx.globalCompositeOperation = "source-over";
    ctx.stroke();
    const cx = mapToScreen.x(this.position.x + 0.5);
    const cy = mapToScreen.y(this.position.y - 0.5);
    ctx.fillStyle = COLORS.WHITE;
    ctx.beginPath();
    ctx.arc(cx, cy, COORDS.width(TILE_DIMENSIONS.QUARTER), 0, TAU);
    ctx.fill();
    ctx.fillStyle = COLORS.BACKGROUND;

    const label = this.display.substr(0, 1);
    const metrics = ctx.measureText(label);
    ctx.fillText(this.display.substr(0, 1), cx, cy + metrics.actualBoundingBoxAscent / 2);
    ctx.restore();
  }
}
