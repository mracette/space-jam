import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import {
  AnyInstrument,
  INSTRUMENT_FACTORIES,
  INSTRUMENT_LIST
} from "./entities/instruments/factories";
import {
  AnyOscillator,
  OSCILLATOR_FACTORIES,
  OSCILLATOR_LIST
} from "./entities/oscillators/factories";
import { Oscillator } from "./entities/oscillators/Oscillator";
import { ASPECT_RATIO, CANVAS_CONTEXTS, ELEMENTS, FONT_STYLE, TAU } from "./globals";
import { COLORS } from "./globals/colors";
import { dragEntityToMap } from "./interactions";
import { clearCanvasAndState } from "./utils/canvas";
import { abbreviateNumber, toggleMenu } from "./utils/dom";
import { lerp, rotatePoint } from "./utils/math";

const drawMenuButtonUi = (
  canvas: HTMLCanvasElement,
  entity: AnyOscillator | AnyInstrument
): void => {
  clearCanvasAndState(canvas);
  const ctx = canvas.getContext("2d");
  const type = entity.id.substr(0, 2);
  if (entity.name === "oscillator") {
    (entity as AnyOscillator).renderBaseShape(
      canvas.width / 2,
      canvas.height / 1.75,
      ctx,
      canvas.width * (type === "co" ? 0.15 : 0.3),
      canvas.width / 15
    );
    ctx.stroke();
  }
  if (entity.name === "instrument") {
    canvas.width = ELEMENTS.canvasInstruments.width;
    canvas.height = ELEMENTS.canvasInstruments.height;
    const zoom = 5.5;
    const { x: ax, y: ay } = ASPECT_RATIO;
    ctx.save();
    ctx.setTransform(
      zoom,
      0,
      0,
      (zoom * ay) / ax,
      (-(zoom - 1) * canvas.width) / 2,
      (-((zoom * ay) / ax - 1) * canvas.height) / 2
    );
    entity.render(ctx);
    ctx.restore();
    ctx.scale(1, ay / ax);
  }
  ctx.font = `${canvas.width / 5}px ${FONT_STYLE}`;
  ctx.fillStyle = COLORS.WHITE;
  ctx.textAlign = "center";
  const text = abbreviateNumber(entity.cost);
  const metrics = ctx.measureText(text);
  ctx.fillText(text, canvas.width / 2, metrics.actualBoundingBoxAscent * 1.75);
};

export const setupMenuUI = (): void => {
  const allFactories = [...OSCILLATOR_FACTORIES, ...INSTRUMENT_FACTORIES];
  [...OSCILLATOR_LIST, ...INSTRUMENT_LIST].forEach((entity, i) => {
    const button = document.createElement("button");
    const canvas = document.createElement("canvas");
    button.append(canvas);
    // button.disabled = true;
    button.id = entity.id;

    // appends button to it's corresponding <div /> in the menu
    const type = entity.id.substr(0, 2);
    (ELEMENTS as any)[type].append(button);

    Object.assign(button.style, {
      width: "7.5vh",
      height: "7.5vh",
      background: COLORS.BACKGROUND
    });

    button.onclick = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      toggleMenu();
      dragEntityToMap(entity, allFactories[i]);
    };

    const observer = new ResizeObserver(() => {
      clearCanvasAndState(canvas);
      console.log(entity.name);
      drawMenuButtonUi(canvas, entity);
    });

    observer.observe(button);
  });
};
