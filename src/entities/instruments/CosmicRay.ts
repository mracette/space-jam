import { Instrument } from "./Instrument";
import { CosmicRaySound } from "../../sounds/CosmicRaySound";

export class CosmicRay extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "cs";
    this.display = "Cosmic Ray";
    this.cost = 5000;
    this.notes = 75;
    this.outline = [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 0],
      [2, -1],
      [1, -1],
      [0, -1],
      [0, -2],
      [-1, -2],
      [-1, -1],
      [-1, 0]
    ];
    this.sound = new CosmicRaySound();
    this.init();
  }
}
