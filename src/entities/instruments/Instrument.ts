import { CANVAS_CONTEXTS, LINE_WIDTH, TILE_DIMENSIONS } from "../../globals";
import { COORDS, ENTITY_ARRAY } from "../../index";
import { mapToEntityArray, mapToScreen } from "../../utils/conversions";
import { MapEntity } from "../MapEntity";

export class Instrument extends MapEntity {
  notes: number;
  shape: number[][];
  scale: number;
  constructor(args: ConstructorParameters<typeof MapEntity>[0]) {
    super(args);
    this.name = "instrument";
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

  move(x: number, y: number): void {
    this.position.set(x, y);
    const ex = mapToEntityArray.x(x);
    const ey = mapToEntityArray.y(y);
    this.shape.forEach((s) => {
      const [sx, sy] = s;
      ENTITY_ARRAY[ex + sx][ex + sy].blocked = true;
    });
    // @ts-ignore
    ENTITY_ARRAY[ex][ey].entity = this;
  }

  render(): void {
    const scaleOffset = (this.scale - 1) / 2;
    CANVAS_CONTEXTS.instrument.fillRect(
      mapToScreen.x(this.position.x - scaleOffset) + COORDS.width(LINE_WIDTH.HALF),
      mapToScreen.y(this.position.y + scaleOffset) + COORDS.width(LINE_WIDTH.HALF),
      COORDS.width(TILE_DIMENSIONS.SIZE * this.scale - LINE_WIDTH.VALUE),
      COORDS.width(TILE_DIMENSIONS.SIZE * this.scale - LINE_WIDTH.VALUE)
    );
  }
}
