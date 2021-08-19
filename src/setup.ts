import {
  OSCILLATOR_CONSTRUCTORS,
  OSCILLATOR_DEFINITIONS
} from "./entities/oscillators/definitions";
import { ELEMENTS, COLORS, FONT_STYLE, CANVAS_CONTEXTS } from "./globals";
import { dragOscillatorToMap } from "./interactions";
import { clearCanvasAndState } from "./utils/canvas";
import { abbreviateNumber, toggleMenu } from "./utils/dom";
import { perlin } from "./utils/perlin";

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

export const setUpPerlinNoise = (): void => {
  const GRID_SIZE = 5;
  const RESOLUTION = 100;
  const COLOR_SCALE = 360;
  const COLOR_ROUND = 25;

  let pixel_size = ELEMENTS.canvasStats.width / RESOLUTION;
  let num_pixels = GRID_SIZE / RESOLUTION;

  perlin.seed();

  const roundColor = (n: number) => {
    return Math.round(n / COLOR_ROUND) * COLOR_ROUND;
  };

  const render = () => {
    for (let y = 0; y < GRID_SIZE; y += num_pixels / GRID_SIZE) {
      for (let x = 0; x < GRID_SIZE; x += num_pixels / GRID_SIZE) {
        let v = parseInt(perlin.get(x, y) * COLOR_SCALE + "");
        console.log(x, y);
        CANVAS_CONTEXTS.stats.fillStyle = "hsl(" + roundColor(v) + ",50%,50%)";
        CANVAS_CONTEXTS.stats.fillRect(
          (x / GRID_SIZE) * ELEMENTS.canvasStats.width,
          (y / GRID_SIZE) * ELEMENTS.canvasStats.width,
          pixel_size,
          pixel_size
        );
      }
    }
  };

  const observer = new ResizeObserver(render);
  observer.observe(ELEMENTS.canvasStats);
};
