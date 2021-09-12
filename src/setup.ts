import {
  InstrumentFactory,
  INSTRUMENT_FACTORIES
} from "./entities/instruments/factories";
import { Instrument } from "./entities/instruments/Instrument";
import {
  AnyOscillator,
  OscillatorFactory,
  OSCILLATOR_FACTORIES
} from "./entities/oscillators/factories";
import { Oscillator } from "./entities/oscillators/Oscillator";
import { ELEMENTS } from "./globals/dom";
import { ASPECT_RATIO } from "./globals/sizes";
import { dragEntityToMap } from "./interactions";
import { clearCanvasAndState } from "./utils/canvas";
import { toggleMenu } from "./utils/dom";

const drawMenuButtonUi = (
  canvas: HTMLCanvasElement,
  entity: Instrument | Oscillator
): void => {
  clearCanvasAndState(canvas);
  const ctx = canvas.getContext("2d");
  const type = entity.id.substr(0, 2);
  if (entity.type === "oscillator") {
    (entity as AnyOscillator).renderBaseShape(
      canvas.width / 2,
      canvas.height / 2,
      ctx,
      canvas.width * (type === "co" ? 0.075 : 0.3),
      canvas.width / 15
    );
    ctx.stroke();
  }
  if (entity.type === "instrument") {
    const instrument = entity as Instrument;
    canvas.width = ELEMENTS.canvasInstruments.width;
    canvas.height = ELEMENTS.canvasInstruments.height;
    const zoom = 8 / Math.max(instrument.boundingBoxWidth, instrument.boundingBoxHeight);
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
    entity.render(ctx, false);
    ctx.restore();
    ctx.scale(1, ay / ax);
  }
};

const setupMenuItemUi = (
  entity: Instrument | Oscillator,
  factory: InstrumentFactory | OscillatorFactory
): void => {
  const { type, cost } = entity;
  // clone the html template for this node
  const node = document
    .getElementById("templates")
    .firstElementChild.cloneNode(true) as HTMLDivElement;

  const button = node.querySelector("button") as HTMLButtonElement;
  button.classList.add("entity-button");
  button.setAttribute("cost", cost.toString());

  const canvas = node.querySelector("canvas") as HTMLCanvasElement;

  node.querySelector("p").innerHTML = entity.display;

  const spans = node.querySelectorAll<HTMLSpanElement>("span");
  spans[0].innerHTML = "-" + entity.cost;

  if (type === "instrument") {
    spans[1].innerHTML = "&nbsp;/&nbsp;";
    spans[2].innerHTML = "+" + (entity as Instrument).notes;
  }

  // appends button to its categorical row in the menu
  const parentId = type === "instrument" ? (entity as Instrument).instrumentType : "os";
  document.getElementById(parentId).append(node);

  button.onclick = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    toggleMenu();
    dragEntityToMap(entity, factory);
  };

  const resizeAll = () => {
    clearCanvasAndState(canvas);
    drawMenuButtonUi(canvas, entity);
  };

  const observer = new ResizeObserver(resizeAll);

  window.addEventListener("resize", resizeAll);

  drawMenuButtonUi(canvas, entity);

  observer.observe(button);
};

export const setupMenuUI = (): void => {
  const allEntities = [...OSCILLATOR_FACTORIES, ...INSTRUMENT_FACTORIES];
  allEntities.forEach((factory) => {
    const modelEntity = factory({ preview: true });
    setupMenuItemUi(modelEntity, factory);
  });
};
