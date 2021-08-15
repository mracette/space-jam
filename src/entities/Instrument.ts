import { Camera } from "./Camera";
import { MapEntity, MapEntityArgs } from "./MapEntity";
import { SvgImage, SvgImageArgs } from "../components/SvgImage";
import { CanvasCoordinates } from "../core/Coords";
import { TILE_DIMENSIONS } from "../globals";
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
  }

  render(ctx: CanvasRenderingContext2D, coords: CanvasCoordinates, camera: Camera): void {
    ctx.drawImage(
      this.svg.image,
      mapToScreen.x(this.position.x, coords, camera),
      mapToScreen.y(this.position.y, coords, camera),
      coords.width(TILE_DIMENSIONS.SIZE),
      coords.width(TILE_DIMENSIONS.SIZE)
    );
  }
}
