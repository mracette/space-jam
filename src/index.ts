import "./styles.css";
import { Kick } from "./entities/instruments/Kick";
import { Snare } from "./entities/instruments/Snare";
import { CircleOscillator1 } from "./entities/oscillators/CircleOscillator1";
import { setupEventListeners } from "./events";
import { AUDIO } from "./globals/audio";
import { CAMERA, STATS } from "./globals/game";
import { setupMenuUI } from "./setup";

import {
  INSPECT_VISIBLE,
  MENU_VISIBLE,
  updateButtonDisabled,
  updateInspectMenu
} from "./utils/dom";
// @ts-ignore
// import * as Stats from "stats.js";

const begin = async () => {
  await AUDIO.init();
  setupEventListeners();
  setupMenuUI();
  updateButtonDisabled();
  CAMERA.updateViewport();

  new Kick({ x: 1, y: 0 });
  new Snare({ x: -1, y: 0 });
  new CircleOscillator1({ x: 0, y: 0 });

  // const stats = new Stats();
  // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  // document.body.appendChild(stats.dom);
  // stats.dom.style.width = "unset";
  // stats.dom.style.height = "unset";

  let prevNotes = 0;
  // let prevTime = 0;

  const render = (time: number) => {
    // const delta = (time - prevTime) / 1000;
    // prevTime = time;
    // stats.begin();
    CAMERA.render();
    if ((MENU_VISIBLE || INSPECT_VISIBLE) && STATS.currentNotes !== prevNotes) {
      updateButtonDisabled();
      updateInspectMenu();
    }
    prevNotes = STATS.currentNotes;
    // stats.end();
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
};

window.addEventListener("DOMContentLoaded", () => {
  begin();
});
