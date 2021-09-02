import {
  AnyInstrument,
  InstrumentId,
  INSTRUMENT_FACTORIES,
  INSTRUMENT_LIST
} from "./entities/instruments/factories";
import {
  AnyOscillator,
  OscillatorIds,
  OSCILLATOR_FACTORIES,
  OSCILLATOR_LIST
} from "./entities/oscillators/factories";
import { COLORS } from "./globals/colors";
import { ELEMENTS } from "./globals/dom";
import { DEBUG } from "./globals/game";
import { ASPECT_RATIO } from "./globals/sizes";
import { FONT_STYLE, STYLES } from "./globals/styles";
import { dragEntityToMap } from "./interactions";
import { clearCanvasAndState } from "./utils/canvas";
import { toggleMenu } from "./utils/dom";
import { abbreviateNumber } from "./utils/math";

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
      canvas.height / 2,
      ctx,
      canvas.width * (type === "co" ? 0.15 : 0.3),
      canvas.width / 15
    );
    ctx.stroke();
  }
  if (entity.name === "instrument") {
    const instrument = entity as AnyInstrument;
    canvas.width = ELEMENTS.canvasInstruments.width;
    canvas.height = ELEMENTS.canvasInstruments.height;
    const zoom = 5 / Math.max(instrument.boundingBoxWidth, instrument.boundingBoxHeight);
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

export const setupMenuUI = (): void => {
  const allEntities = [...OSCILLATOR_LIST, ...INSTRUMENT_LIST];
  allEntities.forEach((entity, i) => {
    const id = entity.id as OscillatorIds | InstrumentId;
    const name = entity.name;

    // clone the html template for this node
    const node = document
      .getElementById("templates")
      .firstElementChild.cloneNode(true) as HTMLDivElement;

    const button = node.querySelector("button") as HTMLButtonElement;
    const canvas = node.querySelector("canvas") as HTMLCanvasElement;

    node.querySelector("p").innerHTML = entity.display;

    const spans = node.querySelectorAll("span");
    spans[0].innerHTML = "-" + entity.cost;

    if (name === "instrument") {
      spans[1].innerHTML = "&nbsp;/&nbsp;";
      spans[2].innerHTML = "+" + (entity as AnyInstrument).notes;
    }

    // appends button to its categorical row in the menu
    const parentId = name === "instrument" ? (entity as AnyInstrument).type : "os";
    (ELEMENTS as any)[parentId].append(node);

    button.onclick = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      toggleMenu();
      dragEntityToMap(
        allEntities[i],
        name === "instrument"
          ? INSTRUMENT_FACTORIES[id as InstrumentId]
          : OSCILLATOR_FACTORIES[id as OscillatorIds]
      );
    };

    const observer = new ResizeObserver(() => {
      clearCanvasAndState(canvas);
      drawMenuButtonUi(canvas, entity);
    });

    observer.observe(button);
  });
};

export const setupBaseStyles = (): void => {
  Object.entries(ELEMENTS).forEach(([k, v]) => {
    Object.assign(v.style, STYLES[k as keyof typeof STYLES]);
  });

  document.body.style.background = "black";
  // document.body.style.background = COLORS.BACKGROUND;
};
