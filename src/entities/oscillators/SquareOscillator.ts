import { Oscillator } from "./Oscillator";
import { CANVAS_CONTEXTS, LINE_WIDTH, TILE_DIMENSIONS } from "../../globals";
import { COORDS } from "../../index";
import { mapToScreen } from "../../utils/conversions";

export class SquareOscillator extends Oscillator {
  width: number;
  constructor(args: ConstructorParameters<typeof Oscillator>[0] = {}) {
    super(args);
    this.width = 1;
  }

  renderBaseShape(
    cx: number,
    cy: number,
    width: number = COORDS.width(TILE_DIMENSIONS.SIZE * this.width - LINE_WIDTH.DOUBLE),
    lineWidth: number = COORDS.width(LINE_WIDTH.VALUE),
    color: string = this.disabled ? this.colorDisabled : this.color
  ): void {
    CANVAS_CONTEXTS.oscillator.strokeStyle = color;
    CANVAS_CONTEXTS.oscillator.fillStyle = color;
    CANVAS_CONTEXTS.oscillator.lineWidth = lineWidth;
    CANVAS_CONTEXTS.oscillator.beginPath();
    CANVAS_CONTEXTS.oscillator.strokeRect(cx - width / 2, cy - width / 2, width, width);
    CANVAS_CONTEXTS.oscillator.stroke();
  }

  render(): void {
    const cx = mapToScreen.x(this.position.x + 0.5);
    const cy = mapToScreen.y(this.position.y - 0.5);
    this.renderBaseShape(cx, cy);
    this.renderArm(cx, cy);
  }
}
