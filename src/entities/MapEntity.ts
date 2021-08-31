import { Entity, EntityArgs } from "./Entity";
import { Vector2, Vector2Args } from "../core/Vector2";
import { COLORS } from "../globals/colors";

type MapEntityArgs = EntityArgs & Vector2Args & { preview?: boolean; id?: string };

export class MapEntity extends Entity {
  public display: string;
  public id: string;
  public position: Vector2;
  public preview: boolean;
  public disabled: boolean;
  public notesProduced: number;
  public cost: number;
  public sell: number;
  public colorDisabled: string;
  public color: string;
  constructor(args: MapEntityArgs = {}) {
    super(args);
    const { x, y, preview = false, id = "" } = args;
    this.id = id;
    this.preview = preview;
    this.position = new Vector2(x, y);
    this.notesProduced = 0;
    this.colorDisabled = COLORS.DISABLED;
  }
}
