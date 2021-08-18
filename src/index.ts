import { Position } from "./components/Position";
import Scheduler from "./core/AudioScheduler";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { Circle0 } from "./entities/instruments/Circle0";
import { Circle1 } from "./entities/instruments/Circle1";
import { CircleOscillator1 } from "./entities/oscillators/CircleOscillator1";
import { CircleOscillator2 } from "./entities/oscillators/CircleOscillator2";
import { SquareOscillator1 } from "./entities/oscillators/SquareOscillator1";
import { TriangleOscillator1 } from "./entities/oscillators/TriangleOscillator1";
import { initializeEventListeners } from "./events";
import {
  ELEMENTS,
  COLORS,
  ENTITY_ARRAY_DIMENSIONS,
  ENTITY_STATE,
  STATS,
  CANVAS_CONTEXTS
} from "./globals";

export interface EntityArrayElement {
  entity?: any;
  state?: ENTITY_STATE;
  stateEndsTime?: number;
  screen: Position;
}

export const PREVIEW_ENTITY: EntityArrayElement = {
  screen: new Position()
};

export const ENTITY_ARRAY: EntityArrayElement[][] = Array.from({
  length: ENTITY_ARRAY_DIMENSIONS.W
}).map(() => Array.from({ length: ENTITY_ARRAY_DIMENSIONS.H }, Object));

ENTITY_ARRAY.forEach((row) => {
  row.forEach((col) => {
    col.screen = new Position();
  });
});

export const AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();
export const SCHEDULER = new Scheduler(AUDIO_CTX);

const coords = new CanvasCoordinates(ELEMENTS.canvasTiles);
const camera = new Camera({ coords });

initializeEventListeners(coords, camera);

new Circle0({ x: 0, y: 0 });
new CircleOscillator1({ x: -1, y: 0 }).move(-1, 0);

const drawStats = (ctx: CanvasRenderingContext2D, coords: CanvasCoordinates) => {
  ctx.font = `${coords.width(0.035)}px sans-serif`;
  ctx.fillStyle = COLORS.WHITE;
  const text = "Notes: " + STATS.notes;
  ctx.fillText(text, coords.nx(-0.95), coords.ny(-0.95));
};

const main = () => {
  camera.render();
  drawStats(CANVAS_CONTEXTS.stats, coords);
  window.requestAnimationFrame(main);
};

window.requestAnimationFrame(main);

camera.move(0, 0);
