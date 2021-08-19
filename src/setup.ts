import { OSCILLATOR_DEFINITIONS } from "./entities/oscillators/definitions";
import { ELEMENTS, COLORS, FONT_STYLE } from "./globals";
import { dragOscillatorToMap } from "./interactions";
import { clearCanvasAndState } from "./utils/canvas";
import { abbreviateNumber, toggleMenu } from "./utils/dom";

const drawOscillatorUi = (
  canvas: HTMLCanvasElement,
  oscillator: typeof OSCILLATOR_DEFINITIONS[number]
): void => {
  clearCanvasAndState(canvas);
  const ctx = canvas.getContext("2d");
  const type = oscillator.id.substr(0, 2);
  oscillator.renderBaseShape(
    canvas.width / 2,
    canvas.height / 1.75,
    canvas.width * (type === "co" ? 0.15 : 0.3),
    canvas.width / 15
  );
  ctx.stroke();
  ctx.font = `${canvas.width / 5}px ${FONT_STYLE}`;
  ctx.fillStyle = COLORS.WHITE;
  ctx.textAlign = "center";
  const text = abbreviateNumber(oscillator.cost);
  const metrics = ctx.measureText(text);
  ctx.fillText(text, canvas.width / 2, metrics.actualBoundingBoxAscent * 1.75);
};

export const setupOscillatorUI = (): void => {
  OSCILLATOR_DEFINITIONS.forEach((oscillator) => {
    const button = document.createElement("button");
    const canvas = document.createElement("canvas");
    button.append(canvas);
    // button.disabled = true;
    button.id = oscillator.id;

    // appends button to it's corresponding <div /> in the menu
    const type = oscillator.id.substr(0, 2);
    (ELEMENTS as any)[type].append(button);

    Object.assign(button.style, {
      width: "7.5vh",
      height: "7.5vh",
      background: COLORS.BACKGROUND
    });

    button.onclick = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      toggleMenu();
      dragOscillatorToMap(oscillator);
    };

    const observer = new ResizeObserver(() => {
      clearCanvasAndState(canvas);
      drawOscillatorUi(canvas, oscillator);
    });

    observer.observe(button);
  });
};
