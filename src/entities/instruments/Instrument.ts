import { CANVAS_CONTEXTS, LINE_WIDTH, TAU, TILE_DIMENSIONS } from "../../globals";
import { COLORS } from "../../globals/colors";
import { COORDS, ENTITY_ARRAY, OFFSCREEN } from "../../index";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { lerp, rotatePoint } from "../../utils/math";
import { MapEntity } from "../MapEntity";

export class Instrument extends MapEntity {
  notes: number;
  shape: number[][];
  outline: number[][];
  constructor(args: ConstructorParameters<typeof MapEntity>[0]) {
    super(args);
    this.name = "instrument";
  }

  init(): void {
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
    for (let i = 0; i < this.outline.length; i++) {
      const [x, y] = this.outline[i];
      /**
       * this logic compensates for the fact that the outline array refers to map coordinates
       * and not the outside of the tiles, where the polygon points need to be
       */
      let xAdj, yAdj;
      if (x >= this.position.x) {
        xAdj = 1;
      } else {
        xAdj = 0;
      }
      if (y < this.position.y) {
        yAdj = -1;
      } else {
        yAdj = 0;
      }
      const sx = mapToScreen.x(this.position.x + x + xAdj);
      const sy = mapToScreen.y(this.position.y + y + yAdj);
      const lwh = COORDS.width(LINE_WIDTH.HALF);
      const lx = (xAdj || -1) * -1 * lwh;
      const ly = (yAdj || 1) * lwh;
      if (i === 0) {
        CANVAS_CONTEXTS.instrument.moveTo(sx + lx, sy + ly);
      } else {
        CANVAS_CONTEXTS.instrument.lineTo(sx + lx, sy + ly);
      }
    }
    CANVAS_CONTEXTS.instrument.closePath();
    CANVAS_CONTEXTS.instrument.fill();
    CANVAS_CONTEXTS.instrument.globalCompositeOperation = "source-atop";
    CANVAS_CONTEXTS.instrument.drawImage(
      OFFSCREEN,
      mapToScreen.x(this.position.x - 1.5),
      mapToScreen.y(this.position.y + 1.5)
    );

    CANVAS_CONTEXTS.instrument.globalCompositeOperation = "source-over";
    CANVAS_CONTEXTS.instrument.beginPath();
    CANVAS_CONTEXTS.instrument.arc(
      mapToScreen.x(this.position.x + 0.5),
      mapToScreen.y(this.position.y - 0.5),
      COORDS.width(TILE_DIMENSIONS.QUARTER),
      0,
      TAU
    );
    CANVAS_CONTEXTS.instrument.stroke();
    CANVAS_CONTEXTS.instrument.fill();
  }
}
