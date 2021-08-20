import { CanvasCoordinates } from "./core/Coords";
import {
  OSCILLATOR_CONSTRUCTORS,
  OSCILLATOR_DEFINITIONS
} from "./entities/oscillators/definitions";
import { CANVAS_CONTEXTS, ELEMENTS, FONT_STYLE, TAU } from "./globals";
import { COLORS } from "./globals/colors";
import { dragOscillatorToMap } from "./interactions";
import { clearCanvasAndState } from "./utils/canvas";
import { abbreviateNumber, toggleMenu } from "./utils/dom";
import { lerp, rotatePoint } from "./utils/math";

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
    ctx,
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
  OSCILLATOR_DEFINITIONS.forEach((oscillator, i) => {
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
      dragOscillatorToMap(oscillator, OSCILLATOR_CONSTRUCTORS[i]);
    };

    const observer = new ResizeObserver(() => {
      clearCanvasAndState(canvas);
      drawOscillatorUi(canvas, oscillator);
    });

    observer.observe(button);
  });
};

export const setupOfflineCanvas = (): OffscreenCanvas => {
  const canvas = new OffscreenCanvas(300, 300);
  const ctx = canvas.getContext("2d");
  const coords = new CanvasCoordinates(canvas);
  const HSL_BAND = [50, 300];
  const numCircles = 10;
  const overallRadius = coords.width(0.5);
  const circleDistance = overallRadius / numCircles;
  const dotSize = circleDistance / 5;
  const cx = coords.nx(0);
  const cy = coords.ny(0);
  for (let i = 0; i < numCircles; i++) {
    const radius = i * circleDistance;
    const circum = 2 * Math.PI * radius;
    const numDots = Math.round(circum / (dotSize * 4));
    for (let j = 0; j < numDots; j++) {
      const rotation = j * (TAU / numDots);
      const rotationProportion = rotation / TAU;
      const rotationProportionAdj = rotationProportion + Math.random() / 2; // + (Math.random() / 2) * (radius / overallRadius);
      const { x, y } = rotatePoint(cx + radius, cy, cx, cy, rotation);
      ctx.fillStyle = `hsl(${lerp(
        HSL_BAND[0],
        HSL_BAND[1],
        rotationProportionAdj % 1
      )}, 60%, 50%)`;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, TAU);
      ctx.fill();
    }
  }
  return canvas;
};
