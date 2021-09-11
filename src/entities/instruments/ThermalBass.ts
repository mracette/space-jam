import { Instrument } from "./Instrument";
import { ThermalBassSound } from "../../sounds/ThermalBassSound";

export class Bass extends Instrument {
  constructor(args: ConstructorParameters<typeof Instrument>[0] = {}) {
    super(args);
    this.instrumentType = "cs";
    this.display = "Thermal Bass";
    this.cost = 250;
    this.notes = 10;
    this.outline = [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
      [2, -1],
      [2, -2],
      [1, -2],
      [0, -2],
      [-1, -2],
      [-1, -1],
      [0, -1]
    ];
    this.sound = new ThermalBassSound();
    this.init();
  }
}
