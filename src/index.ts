import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { Basic1 } from "./entities/instruments/Basic1";
import { Basic2 } from "./entities/instruments/Basic2";
import { Basic3 } from "./entities/instruments/Basic3";
import { AnyInstrument } from "./entities/instruments/factories";
import { CircleOscillator1 } from "./entities/oscillators/CircleOscillator1";
import { AnyOscillator } from "./entities/oscillators/factories";
import { initializeEventListeners } from "./events";
import { AUDIO } from "./globals/audio";
import { ELEMENTS } from "./globals/dom";
import { DEBUG, ENTITY_STATE, STATS } from "./globals/game";
import { ENTITY_ARRAY_DIMENSIONS } from "./globals/sizes";
import { setupBaseStyles, setupMenuUI } from "./setup";

import { MENU_VISIBLE, updateButtonDisabled } from "./utils/dom";
// @ts-ignore
// import * as Stats from "stats.js";

export interface EntityArrayElement {
  entity?: AnyInstrument | AnyOscillator;
  state?: ENTITY_STATE;
  stateEndsTime?: number;
  blocked?: boolean;
}

export const ENTITY_ARRAY: EntityArrayElement[][] = Array.from({
  length: ENTITY_ARRAY_DIMENSIONS.W
}).map(() => Array.from({ length: ENTITY_ARRAY_DIMENSIONS.H }, Object));

export const COORDS = new CanvasCoordinates(ELEMENTS.canvasTiles);
export const CAMERA = new Camera({ coords: COORDS });

const begin = async () => {
  await AUDIO.init();
  initializeEventListeners();
  setupMenuUI();
  setupBaseStyles();
  updateButtonDisabled();
  CAMERA.updateViewport();

  new Basic1({ x: 1, y: 0 });
  new CircleOscillator1({ x: 0, y: 0 });

  // const stats = new Stats();
  // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  // document.body.appendChild(stats.dom);
  // stats.dom.style.width = "unset";
  // stats.dom.style.height = "unset";

  let prevNotes = STATS.notes;
  // let prevTime = 0;

  const render = (time: number) => {
    // const delta = (time - prevTime) / 1000;
    // prevTime = time;
    prevNotes = STATS.notes;
    // stats.begin();
    CAMERA.render();
    if (MENU_VISIBLE && STATS.notes !== prevNotes) {
      updateButtonDisabled();
    }
    // stats.end();
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};

// window.addEventListener("DOMContentLoaded", begin);
begin();
