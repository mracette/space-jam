import { CAMERA } from "./index";
import { INSTRUMENT_CACHE } from "./entities/instruments/cache";
import { AUDIO } from "./globals/audio";
import { ELEMENTS } from "./globals/dom";
import { MOUSE_POSITION } from "./globals/sizes";
import { screenToMap } from "./utils/conversions";
import { MENU_VISIBLE, toggleMenu } from "./utils/dom";
import { drawFog, drawStarPattern } from "./utils/drawing";
import {
  getEventType,
  getMouseOrTouchPosition,
  resizeWithAspectRatio,
  calculatePositionDelta
} from "./utils/events";

export const initializeEventListeners = (): void => {
  [
    ELEMENTS.canvasTiles,
    ELEMENTS.canvasPre,
    ELEMENTS.canvasPost,
    ELEMENTS.canvasStats,
    ELEMENTS.canvasOscillators,
    ELEMENTS.canvasInstruments,
    ELEMENTS.menu
  ].forEach((element) => {
    resizeWithAspectRatio(element);
  });

  ELEMENTS.menuButton.onclick = toggleMenu;

  const onMouseMove = (e: MouseEvent) => {
    MOUSE_POSITION.screenX = e.x;
    MOUSE_POSITION.screenY = e.y;
    MOUSE_POSITION.mapX = screenToMap.x(e.x);
    MOUSE_POSITION.mapY = screenToMap.y(e.y);
  };

  // helps with memory to keep these outside the listener
  const samples = 4;
  const velocityX: number[] = [].fill(0, 0, samples);
  const velocityY: number[] = [].fill(0, 0, samples);

  const onMouseOrTouchDown = (e: MouseEvent | TouchEvent) => {
    AUDIO.context.resume();

    if (!MENU_VISIBLE) {
      const { x: xStart, y: yStart } = getMouseOrTouchPosition(e);
      const type = getEventType(e);

      const onMouseOrTouchMove = (e: MouseEvent | TouchEvent) => {
        const { x, y } = calculatePositionDelta(
          e,
          ELEMENTS.canvasTiles.clientWidth,
          xStart,
          ELEMENTS.canvasTiles.clientHeight,
          yStart
        );

        if ((velocityX.length = samples)) {
          velocityX.shift();
        }
        if ((velocityY.length = samples)) {
          velocityY.shift();
        }
        velocityX.push(x);
        velocityY.push(y);

        CAMERA.move(x, y);
      };

      const cleanUp = () => {
        document.removeEventListener("mousemove", onMouseOrTouchMove);
        document.removeEventListener("touchmove", onMouseOrTouchMove);
        document.addEventListener("mousemove", onMouseMove);
        CAMERA.velocity.x = velocityX.reduce((a, b) => a + b) / samples;
        CAMERA.velocity.y = velocityY.reduce((a, b) => a + b) / samples;
      };

      // bind mouse and touch listeners and clean up at the end of the interaction
      if (type === "mouse") {
        document.addEventListener("mousemove", onMouseOrTouchMove);
        document.addEventListener("mouseup", cleanUp, { once: true });
      } else {
        document.addEventListener("touchmove", onMouseOrTouchMove);
        document.addEventListener("touchend", cleanUp, { once: true });
      }

      // remove mouse listener while mouse/touch down
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onMouseOrTouchDown);
  document.addEventListener("touchstart", onMouseOrTouchDown);

  const onResize = () => {
    drawStarPattern();
    drawFog();
    // set up updates for offscreen canvas elements
    INSTRUMENT_CACHE.forEach((cache) => {
      cache.offscreen.needsUpdate = true;
    });
    // runs animations pegged to camera movement
    CAMERA.move(0, 0);
  };

  const observer = new ResizeObserver(onResize);
  observer.observe(ELEMENTS.canvasTiles);
};
