import { CAMERA } from "./index";
import { INSTRUMENT_CACHE } from "./entities/instruments/cache";
import { AUDIO } from "./globals/audio";
import { ELEMENTS } from "./globals/dom";
import { MOUSE_POSITION, TILE_DIMENSIONS } from "./globals/sizes";
import { screenToMap } from "./utils/conversions";
import { INSPECT_VISIBLE, MENU_VISIBLE, toggleInspect, toggleMenu } from "./utils/dom";
import { drawFog, drawStarPattern } from "./utils/drawing";
import { resizeWithAspectRatio } from "./utils/events";

export const initializeEventListeners = (): void => {
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

  /**
   * Toggle the main menu
   */

  ELEMENTS.menuButton.onclick = toggleMenu;

  const closeMenu = (e: KeyboardEvent) => {
    if (e.key === "Escape" && MENU_VISIBLE) {
      toggleMenu();
    }
  };

  document.addEventListener("keydown", closeMenu);

  /**
   * Toggle the inspect menu
   */

  ELEMENTS.inspect.onclick = toggleInspect;

  /**
   * Update the mouse position
   */

  const updateMousePosition = (e: MouseEvent) => {
    MOUSE_POSITION.screenX = e.x;
    MOUSE_POSITION.screenY = e.y;
    MOUSE_POSITION.mapX = screenToMap.x(e.x);
    MOUSE_POSITION.mapY = screenToMap.y(e.y);
  };

  document.addEventListener("mousemove", updateMousePosition);

  /**
   * Handle camera movement
   */

  const moveCamera = (e: MouseEvent) => {
    AUDIO.context.resume();
    const tileSizePixels = ELEMENTS.canvasTiles.clientWidth * TILE_DIMENSIONS.SIZE;

    console.log(INSPECT_VISIBLE);
    if (!MENU_VISIBLE && !INSPECT_VISIBLE) {
      let xStart = e.clientX;
      let yStart = e.clientY;
      const { x: xCameraStart, y: yCameraStart } = CAMERA.position;
      const updateCameraPosition = (e: MouseEvent) => {
        const dx = e.clientX - xStart;
        const dy = e.clientY - yStart;
        CAMERA.position.set(
          xCameraStart - dx / tileSizePixels,
          yCameraStart + dy / tileSizePixels
        );
        CAMERA.updateViewport();
      };

      const cleanUp = () => {
        document.removeEventListener("mousemove", updateCameraPosition);
        document.addEventListener("mousemove", updateMousePosition);
      };

      // bind mouse and touch listeners and clean up at the end of the interaction
      document.addEventListener("mousemove", updateCameraPosition);
      document.addEventListener("mouseup", cleanUp, { once: true });

      // remove mouse listener while mouse/touch down
      document.removeEventListener("mousemove", updateMousePosition);
    }
  };

  document.addEventListener("mousedown", moveCamera, { capture: false });

  /**
   * Handle resize events
   */

  const onResize = () => {
    drawStarPattern();
    drawFog();
    // set up updates for offscreen canvas elements
    INSTRUMENT_CACHE.forEach((cache) => {
      cache.offscreen.needsUpdate = true;
    });
    // runs animations pegged to camera movement
    CAMERA.updateViewport();
  };

  const observer = new ResizeObserver(onResize);
  observer.observe(ELEMENTS.canvasTiles);
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
};
