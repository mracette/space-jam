import { clearCanvasAndState } from "./canvas";
import { entityArrayToScreen } from "./conversions";
import { lerp, rotatePoint } from "./math";
import { CanvasCoordinates } from "../core/Coords";
import { COLORS } from "../globals/colors";
import { CANVAS_CONTEXTS } from "../globals/dom";
import { ELEMENTS } from "../globals/dom";
import { STATS } from "../globals/game";
import { TAU } from "../globals/math";
import { LINE_WIDTH, TILE_DIMENSIONS, VIEWPORT_DIMENSIONS } from "../globals/sizes";
import { CAMERA, COORDS } from "../index";

export const drawInstrumentPattern = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = COLORS.BACKGROUND_LIGHT;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const drawStarPattern = (
  canvas: HTMLCanvasElement = ELEMENTS.canvasPre,
  hueStart = 50,
  hueEnd = 300
): void => {
  const ctx = canvas.getContext("2d");
  const designRadius = Math.sqrt((Math.max(canvas.width, canvas.height) / 2) ** 2 * 2);
  const ringDistance = designRadius / 150;
  const numRings = designRadius / ringDistance;
  const dotSize = ringDistance / 5;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  for (let i = 0; i < numRings; i++) {
    const ringRadius = i * ringDistance;
    const circumference = 2 * Math.PI * ringRadius;
    const numDots = Math.round(circumference / (dotSize * 4));

    for (let j = 0; j < numDots; j++) {
      const rotation = j * (TAU / numDots);
      const rotationProportion = rotation / TAU;
      const rotationProportionAdj = rotationProportion + Math.random() / 2;
      const { x, y } = rotatePoint(cx + ringRadius, cy, cx, cy, rotation);
      ctx.fillStyle = `hsl(${lerp(
        hueStart,
        hueEnd,
        rotationProportionAdj % 1
      )}, 50%, 50%)`;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, TAU);
      ctx.fill();
    }
  }
};

export const drawOutline = (
  ctx: CanvasRenderingContext2D | Path2D,
  outline: number[][]
): void => {
  for (let i = 0; i < outline.length; i++) {
    const [x, y] = outline[i];
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
};

export const limitDrawingToArc = (
  ctx: CanvasRenderingContext2D,
  operation: () => unknown
): void => {
  // ctx.save();
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, COORDS.width(), COORDS.height());
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(
    COORDS.nx(0),
    COORDS.ny(0),
    COORDS.width(TILE_DIMENSIONS.SIZE * VIEWPORT_DIMENSIONS.W_HALF),
    0,
    TAU
  );

  ctx.fill();
  ctx.globalCompositeOperation = "source-atop";
  operation();
  ctx.globalCompositeOperation = "source-over";
  // ctx.restore();
};

export const drawFog = (): void => {
  const fog = CANVAS_CONTEXTS.post.createRadialGradient(
    COORDS.nx(0),
    COORDS.ny(0),
    COORDS.width((VIEWPORT_DIMENSIONS.W_HALF / 2) * TILE_DIMENSIONS.SIZE),
    COORDS.nx(0),
    COORDS.ny(0),
    COORDS.width(VIEWPORT_DIMENSIONS.W_HALF * TILE_DIMENSIONS.SIZE)
  );
  fog.addColorStop(0, COLORS.CLEAR);
  fog.addColorStop(0.25, COLORS.CLEAR);
  fog.addColorStop(1, COLORS.BACKGROUND);

  // draw fog and outer circle
  clearCanvasAndState(ELEMENTS.canvasPost);
  CANVAS_CONTEXTS.post.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.post.strokeStyle = COLORS.WHITE;
  CANVAS_CONTEXTS.post.fillStyle = fog;
  CANVAS_CONTEXTS.post.beginPath();
  CANVAS_CONTEXTS.post.arc(
    COORDS.nx(0),
    COORDS.ny(0),
    COORDS.width(TILE_DIMENSIONS.SIZE * VIEWPORT_DIMENSIONS.W_HALF),
    0,
    TAU
  );
  CANVAS_CONTEXTS.post.fill();
  CANVAS_CONTEXTS.post.stroke();
};

export const drawNoteIncrease = (
  ctx: CanvasRenderingContext2D,
  coords: CanvasCoordinates,
  cx: number,
  cy: number,
  amount: number
): void => {
  const fontSize = coords.width(0.02);
  const tileSize = coords.width(TILE_DIMENSIONS.SIZE);
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  // ctx.arc(cx + tileSize / 2, cy + tileSize / 2, tileSize / 2, 0, TAU);
  // ctx.fill();
  ctx.globalAlpha = 1;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  // ctx.fillStyle = COLORS.WHITE;
  const text = "+" + amount;
  const metrics = ctx.measureText(text);
  ctx.fillText(
    text,
    cx + tileSize / 2,
    cy + tileSize / 2 + metrics.actualBoundingBoxAscent / 2
  );
};

export const drawTile = (
  cx: number,
  cy: number,
  fill = false,
  stroke = true,
  ctx = CANVAS_CONTEXTS.tiles
): void => {
  stroke &&
    ctx.strokeRect(
      cx,
      cy,
      COORDS.width(TILE_DIMENSIONS.SIZE),
      COORDS.width(TILE_DIMENSIONS.SIZE)
    );

  fill &&
    ctx.fillRect(
      cx,
      cy,
      COORDS.width(TILE_DIMENSIONS.SIZE),
      COORDS.width(TILE_DIMENSIONS.SIZE)
    );
};

export const drawGameStats = (): void => {
  clearCanvasAndState(ELEMENTS.canvasStats);
  CANVAS_CONTEXTS.stats.font = `${COORDS.width(0.035)}px sans-serif`;
  CANVAS_CONTEXTS.stats.fillStyle = COLORS.WHITE;
  const text = "Notes: " + STATS.notes;
  CANVAS_CONTEXTS.stats.fillText(text, COORDS.nx(-0.95), COORDS.ny(-0.95));
};

export const addClip = (ctx: CanvasRenderingContext2D): void => {
  ctx.beginPath();
  ctx.arc(
    COORDS.nx(0),
    COORDS.ny(0),
    COORDS.width(TILE_DIMENSIONS.SIZE * VIEWPORT_DIMENSIONS.W_HALF),
    0,
    TAU
  );
  ctx.clip();
};

export const drawTiles = (): void => {
  clearCanvasAndState(ELEMENTS.canvasTiles);
  CANVAS_CONTEXTS.tiles.fillStyle = COLORS.BACKGROUND;
  CANVAS_CONTEXTS.tiles.strokeStyle = COLORS.WHITE;
  CANVAS_CONTEXTS.tiles.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
  addClip(CANVAS_CONTEXTS.tiles);
  CANVAS_CONTEXTS.tiles.fillRect(0, 0, COORDS.width(), COORDS.height());
  CAMERA.applyToEntityArray((_, i, j) => {
    drawTile(entityArrayToScreen.x(i), entityArrayToScreen.y(j));
  });
};

export const drawInstruments = (): void => {
  clearCanvasAndState(ELEMENTS.canvasInstruments);
  CANVAS_CONTEXTS.instrument.fillStyle = COLORS.BACKGROUND;
  CANVAS_CONTEXTS.instrument.strokeStyle = COLORS.WHITE;
  CANVAS_CONTEXTS.instrument.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.instrument.lineJoin = "round";
  addClip(CANVAS_CONTEXTS.instrument);
  CAMERA.applyToEntityArray(({ entity }) => {
    if (entity?.name === "instrument") {
      entity.render();
    }
  });
};

export const drawOscillators = (): void => {
  clearCanvasAndState(ELEMENTS.canvasOscillators);
  CANVAS_CONTEXTS.oscillator.lineCap = "round";
  CANVAS_CONTEXTS.oscillator.lineJoin = "round";
  CANVAS_CONTEXTS.oscillator.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
  addClip(CANVAS_CONTEXTS.oscillator);
  CAMERA.applyToEntityArray(({ entity }) => {
    if (entity?.name === "oscillator") {
      entity.render();
    }
  });
};
