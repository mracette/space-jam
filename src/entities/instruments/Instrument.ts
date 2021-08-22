import { CacheItem, INSTRUMENT_CACHE } from "./cache";
import { COLORS } from "../../globals/colors";
import { CANVAS_CONTEXTS } from "../../globals/dom";
import { TAU } from "../../globals/math";
import { TILE_DIMENSIONS } from "../../globals/sizes";
import { CAMERA, COORDS, ENTITY_ARRAY } from "../../index";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { drawInstrumentPattern } from "../../utils/drawing";
import {
  BoundingBox,
  createShapeFromOutline,
  findBoundingBoxFromOutline
} from "../../utils/geometry";
import { MapEntity } from "../MapEntity";

export class Instrument extends MapEntity {
  cost: number;
  notes: number;
  shape: number[][];
  outline: number[][];
  hueRange: number[];
  entityClass: any;
  boundingBox: BoundingBox;
  boundingBoxWidth: number;
  boundingBoxHeight: number;
  cache: CacheItem;
  constructor(args: ConstructorParameters<typeof MapEntity>[0]) {
    super(args);
    this.name = "instrument";
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
    console.log(isInView, spaceIsTaken, isBlocked, adjacentSpacesAreBlocked);
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

  render(ctx: CanvasRenderingContext2D = CANVAS_CONTEXTS.instrument): void {
    ctx.fillStyle = this.disabled ? COLORS.DISABLED : COLORS.BACKGROUND;
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
    ctx.fill();

    ctx.globalCompositeOperation = "source-atop";

    if (this.cache.offscreen.needsUpdate) {
      this.cache.offscreen.canvas.width =
        this.boundingBoxWidth * COORDS.width(TILE_DIMENSIONS.SIZE);
      this.cache.offscreen.canvas.height =
        this.boundingBoxHeight * COORDS.width(TILE_DIMENSIONS.SIZE);
      drawInstrumentPattern(this.cache.offscreen.canvas);
      this.cache.offscreen.needsUpdate = false;
    }
    if (!this.disabled) {
      ctx.drawImage(
        this.cache.offscreen.canvas,
        mapToScreen.x(this.position.x - (this.boundingBoxWidth - 1) / 2),
        mapToScreen.y(this.position.y + (this.boundingBoxHeight - 1) / 2)
      );
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.stroke();

    ctx.fillStyle = COLORS.WHITE;
    ctx.beginPath();
    ctx.arc(
      mapToScreen.x(this.position.x + 0.5),
      mapToScreen.y(this.position.y - 0.5),
      COORDS.width(TILE_DIMENSIONS.QUARTER),
      0,
      TAU
    );
    ctx.fill();
    ctx.fillStyle = COLORS.BACKGROUND;
  }
}
