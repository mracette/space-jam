import { clearCanvasAndState } from "./canvas";
import { COORDS, entityArrayToScreen } from "./conversions";
import { abbreviateNumber } from "./math";
import { CanvasCoordinates } from "../core/Coords";
import { AUDIO, NUM_FREQ_BANDS } from "../globals/audio";
import { COLORS } from "../globals/colors";
import { CANVAS_CONTEXTS } from "../globals/dom";
import { ELEMENTS } from "../globals/dom";
import { CAMERA, RANDOM_STARS, RANDOM_STREAKS, STATE, STATS } from "../globals/game";
import { TAU } from "../globals/math";
import {
  FONT_SIZE,
  LINE_WIDTH,
  MARGIN_TOP_STATS,
  TILE_DIMENSIONS,
  VIEWPORT_DIMENSIONS
} from "../globals/sizes";
import { FONT_STYLE } from "../globals/styles";

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
};

export const drawAudio = (): void => {
  drawAnalyserBands();
};

export const drawAnalyserBands = (): void => {
  clearCanvasAndState(ELEMENTS.canvasAudio);
  CANVAS_CONTEXTS.audio.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.post.strokeStyle = COLORS.WHITE;
  AUDIO.analyser.getByteFrequencyData(AUDIO.frequencyData);
  const volume =
    AUDIO.frequencyData.reduce((a, b) => a + b) / AUDIO.analyser.frequencyBinCount;
  for (let i = 0; i < NUM_FREQ_BANDS.VALUE; i++) {
    CANVAS_CONTEXTS.audio.strokeStyle = `rgba(255,255,255,${
      1 - (i + 1) / NUM_FREQ_BANDS.VALUE
    })`;
    CANVAS_CONTEXTS.audio.arc(
      COORDS.nx(0),
      COORDS.ny(0),
      COORDS.width(TILE_DIMENSIONS.SIZE * VIEWPORT_DIMENSIONS.W_HALF) +
        (volume * i) / (1 + NUM_FREQ_BANDS.VALUE),
      0,
      TAU
    );
    CANVAS_CONTEXTS.audio.stroke();
  }
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
  const tileSize = coords.width(TILE_DIMENSIONS.QUARTER * 1.1);
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, tileSize, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.font = `${coords.width(FONT_SIZE.HALF)}px ${FONT_STYLE}`;
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.WHITE;
  const text = "+" + amount;
  const metrics = ctx.measureText(text);
  ctx.fillText(text, cx, cy + metrics.actualBoundingBoxAscent / 2);
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

  if (STATE.menuVisible) {
    return;
  }

  /**
   * TITLE
   */
  CANVAS_CONTEXTS.stats.font = `${COORDS.width(FONT_SIZE.TRIPLE)}px ${FONT_STYLE}`;
  CANVAS_CONTEXTS.stats.fillStyle = COLORS.WHITE;
  CANVAS_CONTEXTS.stats.textAlign = "center";
  const textTitle = "SPACE JAM";
  const textTitleMetrics = CANVAS_CONTEXTS.stats.measureText(textTitle);
  CANVAS_CONTEXTS.stats.font = `${COORDS.width(FONT_SIZE.TRIPLE)}px Impact`;
  CANVAS_CONTEXTS.stats.fillText(
    textTitle,
    COORDS.nx(0),
    COORDS.ny(MARGIN_TOP_STATS.VALUE)
  );

  /**
   * CURRENT NOTES
   */
  const textNotes = "Notes: " + abbreviateNumber(STATS.currentNotes);
  CANVAS_CONTEXTS.stats.font = `${COORDS.width(FONT_SIZE.DOUBLE)}px ${FONT_STYLE}`;
  CANVAS_CONTEXTS.stats.fillText(
    textNotes,
    COORDS.nx(0),
    COORDS.ny(MARGIN_TOP_STATS.VALUE) + textTitleMetrics.actualBoundingBoxAscent
  );

  /**
   * CAMERA POSITION
   */
  const textPosition = `Camera: (x: ${Math.round(CAMERA.position.x)}, y: ${Math.round(
    CAMERA.position.y
  )})`;
  CANVAS_CONTEXTS.stats.font = `${COORDS.width(FONT_SIZE.VALUE)}px ${FONT_STYLE}`;
  CANVAS_CONTEXTS.stats.fillText(
    textPosition,
    COORDS.nx(0),
    COORDS.ny(MARGIN_TOP_STATS.VALUE) + textTitleMetrics.actualBoundingBoxAscent * 1.75
  );

  /**
   * SCORE
   */
  CANVAS_CONTEXTS.stats.textAlign = "right";
  const textScore = "Score: " + abbreviateNumber(STATS.totalNotes);
  CANVAS_CONTEXTS.stats.font = `${COORDS.width(FONT_SIZE.VALUE)}px ${FONT_STYLE}`;
  const textScoreMetrics = CANVAS_CONTEXTS.stats.measureText(textScore);
  CANVAS_CONTEXTS.stats.fillText(
    textScore,
    COORDS.nx(0.95),
    COORDS.ny(-1) + textScoreMetrics.actualBoundingBoxAscent + COORDS.width(0.025)
  );

  /**
   * MENU HINT
   */
  if (STATE.hints.menu) {
    CANVAS_CONTEXTS.stats.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
    CANVAS_CONTEXTS.stats.strokeStyle = COLORS.WHITE;
    CANVAS_CONTEXTS.stats.beginPath();
    const menuHint = "Main Menu";
    CANVAS_CONTEXTS.stats.fillText(
      menuHint,
      COORDS.nx(-0.45) + CANVAS_CONTEXTS.stats.measureText(menuHint).width / 2,
      COORDS.ny(0.7)
    );
    CANVAS_CONTEXTS.stats.moveTo(COORDS.nx(-0.45), COORDS.ny(0.725));
    CANVAS_CONTEXTS.stats.quadraticCurveTo(
      COORDS.nx(-0.35),
      COORDS.ny(0.825),
      COORDS.nx(-0.15),
      COORDS.ny(0.825)
    );
    CANVAS_CONTEXTS.stats.moveTo(COORDS.nx(-0.15), COORDS.ny(0.825));
    CANVAS_CONTEXTS.stats.lineTo(COORDS.nx(-0.2), COORDS.ny(0.795));
    CANVAS_CONTEXTS.stats.moveTo(COORDS.nx(-0.15), COORDS.ny(0.825));
    CANVAS_CONTEXTS.stats.lineTo(COORDS.nx(-0.2), COORDS.ny(0.855));
    CANVAS_CONTEXTS.stats.stroke();
  }
};

export const addCircularClip = (ctx: CanvasRenderingContext2D): void => {
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
  addCircularClip(CANVAS_CONTEXTS.tiles);
  CANVAS_CONTEXTS.tiles.fillRect(0, 0, COORDS.width(), COORDS.height());
  CAMERA.applyToEntityArray((_, i, j) => {
    drawTile(entityArrayToScreen.x(i), entityArrayToScreen.y(j));
  });
};

export const drawInstruments = (): void => {
  clearCanvasAndState(ELEMENTS.canvasInstruments);
  CANVAS_CONTEXTS.instrument.font = `${COORDS.width(FONT_SIZE.HALF)}px ${FONT_STYLE}`;
  CANVAS_CONTEXTS.instrument.textAlign = "center";
  CANVAS_CONTEXTS.instrument.fillStyle = COLORS.BACKGROUND;
  CANVAS_CONTEXTS.instrument.strokeStyle = COLORS.WHITE;
  CANVAS_CONTEXTS.instrument.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.instrument.lineJoin = "round";
  addCircularClip(CANVAS_CONTEXTS.instrument);
  CAMERA.applyToEntityArray(({ entity }) => {
    if (entity?.type === "instrument") {
      entity.render();
    }
  });
};

export const drawOscillators = (): void => {
  clearCanvasAndState(ELEMENTS.canvasOscillators);
  CANVAS_CONTEXTS.oscillator.lineCap = "round";
  CANVAS_CONTEXTS.oscillator.lineJoin = "round";
  CANVAS_CONTEXTS.oscillator.lineWidth = COORDS.width(LINE_WIDTH.VALUE);
  addCircularClip(CANVAS_CONTEXTS.oscillator);
  CAMERA.applyToEntityArray(({ entity }) => {
    if (entity?.type === "oscillator") {
      entity.render();
    }
  });
};

export const drawStarPattern = (): void => {
  clearCanvasAndState(ELEMENTS.canvasPre);
  CANVAS_CONTEXTS.pre.fillStyle = "white";
  CANVAS_CONTEXTS.pre.strokeStyle = "white";
  RANDOM_STARS.forEach(([cx, cy, size, rot]) => {
    CANVAS_CONTEXTS.pre.lineWidth = COORDS.width(size);
    drawStar(
      CANVAS_CONTEXTS.pre,
      COORDS.nx(cx),
      COORDS.ny(cy),
      COORDS.width(size * 6),
      rot
    );
    CANVAS_CONTEXTS.pre.fill();
    CANVAS_CONTEXTS.pre.stroke();
  });
  drawStreak(CANVAS_CONTEXTS.pre, COLORS.MAIN_PURPLE_TRANSPARENT, RANDOM_STREAKS[0]);
  drawStreak(CANVAS_CONTEXTS.pre, COLORS.HOT_GREEN_TRANSPARENT, RANDOM_STREAKS[1]);
};

export const drawStreak = (
  ctx: CanvasRenderingContext2D,
  color: string,
  points: number[][]
): void => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = COORDS.width(0.2);
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    const px = COORDS.nx(x);
    const py = COORDS.ny(y);
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  });
  ctx.stroke();
  ctx.restore();
};

export const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rotation: number
): void => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.translate(-cx, -cy);
  ctx.beginPath();
  ctx.moveTo(cx, cy - size / 2);
  ctx.quadraticCurveTo(cx, cy, cx + size / 2, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + size / 2);
  ctx.quadraticCurveTo(cx, cy, cx - size / 2, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - size / 2);
  ctx.restore();
};
