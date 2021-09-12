import "./styles.css";
import { Kick } from "./entities/instruments/Kick";
import { Snare } from "./entities/instruments/Snare";
import { CircleOscillator1 } from "./entities/oscillators/CircleOscillator1";
import { setupEventListeners } from "./events";
import { AUDIO } from "./globals/audio";
import { ELEMENTS } from "./globals/dom";
import { CAMERA, DEBUG, STATE, STATS } from "./globals/game";
import { startGame } from "./interactions";
import { setupMenuUI } from "./setup";

import { updateButtonDisabled, updateInspectMenu } from "./utils/dom";
import { drawAudio } from "./utils/drawing";

const setup = async () => {
  await AUDIO.init();
  setupEventListeners();
  setupMenuUI();
  updateButtonDisabled();
  CAMERA.updateViewport();
  new Kick({ x: 1, y: 0 });
  new Snare({ x: -1, y: 0 });
  new CircleOscillator1({ x: 0, y: 0 });
  ELEMENTS.start.disabled = false;
};

export const begin = (): void => {
  AUDIO.context.resume();
  let prevNotes = 0;
  const render = () => {
    drawAudio();
    CAMERA.render();
    if ((STATE.menuVisible || STATE.inspectVisible) && STATS.currentNotes !== prevNotes) {
      updateButtonDisabled();
      updateInspectMenu();
    }
    prevNotes = STATS.currentNotes;
    window.requestAnimationFrame(render);
  };
  window.requestAnimationFrame(render);
};

setup();
if (DEBUG) {
  startGame();
}
