import { CANVAS_CONTEXTS, COLORS, LINE_WIDTH, TAU, TILE_DIMENSIONS } from "../../globals";
import { COORDS, ENTITY_ARRAY } from "../../index";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { MapEntity } from "../MapEntity";

export class Instrument extends MapEntity {
  notes: number;
  shape: number[][];
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
    for (let i = 0; i < this.shape.length; i++) {
      const [dx, dy] = this.shape[i];
      // CANVAS_CONTEXTS.instrument.fillRect(
      //   mapToScreen.x(this.position.x + dx) + COORDS.width(LINE_WIDTH.HALF),
      //   mapToScreen.y(this.position.y + dy) + COORDS.width(LINE_WIDTH.HALF),
      //   COORDS.width(TILE_DIMENSIONS.SIZE),
      //   COORDS.width(TILE_DIMENSIONS.SIZE)
      // );
      // if (i + 1 < this.shape.length) {
      //   const [dxx, dyy] = this.shape[i + 1];
      //   CANVAS_CONTEXTS.instrument.fillRect(
      //     mapToScreen.x(this.position.x + (dx + dxx) / 2) + COORDS.width(LINE_WIDTH.HALF),
      //     mapToScreen.y(this.position.y + (dy + dyy) / 2) + COORDS.width(LINE_WIDTH.HALF),
      //     COORDS.width(TILE_DIMENSIONS.SIZE - LINE_WIDTH.VALUE),
      //     COORDS.width(TILE_DIMENSIONS.SIZE - LINE_WIDTH.VALUE)
      //   );
      // }
      if (dx === 0 && dy === 0) {
        CANVAS_CONTEXTS.instrument.beginPath();
        CANVAS_CONTEXTS.instrument.arc(
          mapToScreen.x(this.position.x + 0.5),
          mapToScreen.y(this.position.y - 0.5),
          COORDS.width(TILE_DIMENSIONS.QUARTER),
          0,
          TAU
        );
        CANVAS_CONTEXTS.instrument.stroke();
      }
    }
  }
}
