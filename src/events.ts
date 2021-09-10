import { ELEMENTS } from "./globals/dom";
import {
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
  document.addEventListener("mousedown", moveCamera);

  const observer = new ResizeObserver(handleResize);
  observer.observe(ELEMENTS.root);
};
