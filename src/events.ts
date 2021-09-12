import { ELEMENTS } from "./globals/dom";
import {
  checkMouseoverEntity,
  clickMouseOverEntity,
  closeInspect,
  closeMenu,
  handleResize,
  moveCamera,
  sellEntity,
  startGame,
  updateMousePosition
} from "./interactions";
import { toggleInspect, toggleMenu } from "./utils/dom";
import { resizeWithAspectRatio } from "./utils/events";

export const setupEventListeners = (): void => {
  [
    ELEMENTS.canvasTiles,
    ELEMENTS.canvasPre,
    ELEMENTS.canvasPost,
    ELEMENTS.canvasAudio,
    ELEMENTS.canvasStats,
    ELEMENTS.canvasOscillators,
    ELEMENTS.canvasInstruments,
    ELEMENTS.menu,
    ELEMENTS.inspect
  ].forEach((element) => {
    resizeWithAspectRatio(element);
  });

  ELEMENTS.start.addEventListener("click", startGame);
  ELEMENTS.menuButton.addEventListener("click", toggleMenu);
  ELEMENTS.inspectButton.addEventListener("click", toggleInspect);
  ELEMENTS.inspectSellButton.addEventListener("click", sellEntity);

  document.addEventListener("keydown", closeMenu);
  document.addEventListener("keydown", closeInspect);
  document.addEventListener("mousemove", updateMousePosition);
  document.addEventListener("mousemove", checkMouseoverEntity);
  document.addEventListener("mousedown", moveCamera);
  document.addEventListener("click", clickMouseOverEntity);

  const observer = new ResizeObserver(handleResize);
  observer.observe(ELEMENTS.root);
};
