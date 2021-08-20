import { INSTRUMENT_DEFINITIONS } from "./definitions";
import { CANVAS_CONTEXTS, LINE_WIDTH, TAU, TILE_DIMENSIONS } from "../../globals";
import { COLORS } from "../../globals/colors";
import { COORDS, ENTITY_ARRAY } from "../../index";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { drawInstrumentPattern } from "../../utils/drawing";
import {
  BoundingBox,
  createShapeFromOutline,
  findBoundingBoxFromOutline
} from "../../utils/geometry";
import { lerp, rotatePoint } from "../../utils/math";
import { MapEntity } from "../MapEntity";

export class Instrument extends MapEntity {
  notes: number;
  shape: number[][];
  outline: number[][];
  hueRange: number[];
  entityClass: any;
  boundingBox: BoundingBox;
  boundingBoxWidth: number;
  boundingBoxHeight: number;
  definition: any;
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
    this.definition = INSTRUMENT_DEFINITIONS.find((def) => def.id === this.id);
    if (!this.preview) {
      this.placeOnMap();
    }
  }

  fitsInMap(x: number, y: number): boolean {
    const ex = mapToEntityArray.x(x);
    const ey = mapToEntityArray.y(y);
    const entityArrayIsBlocked = Boolean(ENTITY_ARRAY[ex][ey].entity);
    const adjacentSpacesAreBlocked = this.shape.every(
      ([sx, sy]) => !ENTITY_ARRAY[ex + sx][ex + sy].blocked
    );
    return !entityArrayIsBlocked && !adjacentSpacesAreBlocked;
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

  render(): void {
    CANVAS_CONTEXTS.instrument.beginPath();
    for (let i = 0; i < this.outline.length; i++) {
      const [x, y] = this.outline[i];
      const sx = mapToScreen.x(this.position.x + x);
      const sy = mapToScreen.y(this.position.y + y);
      if (i === 0) {
        CANVAS_CONTEXTS.instrument.moveTo(sx, sy);
      } else {
        CANVAS_CONTEXTS.instrument.lineTo(sx, sy);
      }
    }
    CANVAS_CONTEXTS.instrument.closePath();
    CANVAS_CONTEXTS.instrument.fill();

    CANVAS_CONTEXTS.instrument.globalCompositeOperation = "source-atop";

    if (this.definition.offscreen.needsUpdate) {
      this.definition.offscreen.canvas.width =
        this.boundingBoxWidth * COORDS.width(TILE_DIMENSIONS.SIZE);
      this.definition.offscreen.canvas.height =
        this.boundingBoxHeight * COORDS.width(TILE_DIMENSIONS.SIZE);
      drawInstrumentPattern(this.definition.offscreen.canvas);
      this.definition.offscreen.needsUpdate = false;
    }
    CANVAS_CONTEXTS.instrument.drawImage(
      this.definition.offscreen.canvas,
      mapToScreen.x(this.position.x - (this.boundingBoxWidth - 1) / 2),
      mapToScreen.y(this.position.y + (this.boundingBoxHeight - 1) / 2)
    );

    CANVAS_CONTEXTS.instrument.globalCompositeOperation = "source-over";
    CANVAS_CONTEXTS.instrument.stroke();

    CANVAS_CONTEXTS.instrument.fillStyle = COLORS.WHITE;
    CANVAS_CONTEXTS.instrument.beginPath();
    CANVAS_CONTEXTS.instrument.arc(
      mapToScreen.x(this.position.x + 0.5),
      mapToScreen.y(this.position.y - 0.5),
      COORDS.width(TILE_DIMENSIONS.QUARTER),
      0,
      TAU
    );
    CANVAS_CONTEXTS.instrument.fill();
    CANVAS_CONTEXTS.instrument.fillStyle = COLORS.BACKGROUND;
  }
}
