import { Camera } from "./Camera";
import { MapEntity, MapEntityArgs } from "./MapEntity";
import { SvgImage, SvgImageArgs } from "../components/SvgImage";
import { CanvasCoordinates } from "../core/Coords";
import { LINE_WIDTH, TILE_DIMENSIONS } from "../globals";
import { mapToScreen } from "../utils/conversions";

export type InstrumentArgs = MapEntityArgs &
  SvgImageArgs & {
    notes: number;
  };

export class Instrument extends MapEntity {
  svg: SvgImage;
  notes: number;
  constructor(args: InstrumentArgs) {
    super(args);
    const { dataUrl, notes } = args;
    this.svg = new SvgImage(dataUrl);
    this.notes = notes;
    this.name = "instrument";
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    const scaleOffset = (this.scale.scale - 1) / 2;
    ctx.fillRect(
      mapToScreen.x(this.position.x - scaleOffset, coords, camera) +
        coords.width(LINE_WIDTH.HALF),
      mapToScreen.y(this.position.y + scaleOffset, coords, camera) +
        coords.width(LINE_WIDTH.HALF),
      coords.width(TILE_DIMENSIONS.SIZE * this.scale.scale - LINE_WIDTH.VALUE),
      coords.width(TILE_DIMENSIONS.SIZE * this.scale.scale - LINE_WIDTH.VALUE)
    );
    ctx.drawImage(
      this.svg.image,
      mapToScreen.x(this.position.x - scaleOffset, coords, camera) +
        coords.width(LINE_WIDTH.HALF),
      mapToScreen.y(this.position.y + scaleOffset, coords, camera) +
        coords.width(LINE_WIDTH.HALF),
      coords.width(TILE_DIMENSIONS.SIZE * this.scale.scale - LINE_WIDTH.VALUE),
      coords.width(TILE_DIMENSIONS.SIZE * this.scale.scale - LINE_WIDTH.VALUE)
    );
  }
}
