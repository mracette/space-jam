import { AUDIO_CTX } from "./index";
import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { updateScreenDependentGlobals, MOUSE_POSITION, ELEMENTS } from "./globals";
import { screenToMap } from "./utils/conversions";
import {
  getEventType,
  getMouseOrTouchPosition,
  resizeWithAspectRatio,
  calculatePositionDelta
} from "./utils/events";

export const initializeEventListeners = (
  coords: CanvasCoordinates,
  camera: Camera
): void => {
  [
    ELEMENTS.canvasMap,
    ELEMENTS.canvasTiles,
    ELEMENTS.canvasPost,
    ELEMENTS.canvasStats,
    ELEMENTS.canvasGenerators,
    ELEMENTS.canvasInstruments,
    ELEMENTS.menu
  ].forEach((element) => {
    resizeWithAspectRatio(element, new AspectRatio(9, 16));
  });

  ELEMENTS.menuButton.onclick = () => {
    if (ELEMENTS.menu.style.visibility === "hidden") {
      ELEMENTS.menu.style.visibility = "visible";
      ELEMENTS.menuButton.style.transform = "rotate(45deg)";
    } else {
      ELEMENTS.menu.style.visibility = "hidden";
      ELEMENTS.menuButton.style.transform = "rotate(0deg)";
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    MOUSE_POSITION.screenX = e.x;
    MOUSE_POSITION.screenY = e.y;
    MOUSE_POSITION.mapX = screenToMap.x(e.x, coords, camera, ELEMENTS.canvasMap);
    MOUSE_POSITION.mapY = screenToMap.y(e.y, coords, camera, ELEMENTS.canvasMap);
  };

  const onMouseOrTouchDown = (e: MouseEvent | TouchEvent) => {
    AUDIO_CTX.resume();

    const { x: xStart, y: yStart } = getMouseOrTouchPosition(e);
    const type = getEventType(e);

    const onMouseOrTouchMove = (e: MouseEvent | TouchEvent) => {
      const { x, y } = calculatePositionDelta(
        e,
        ELEMENTS.canvasMap.clientWidth,
        xStart,
        ELEMENTS.canvasMap.clientHeight,
        yStart
      );
      camera.move(x, y);
    };

    const cleanUp = () => {
      document.removeEventListener("mousemove", onMouseOrTouchMove);
      document.removeEventListener("touchmove", onMouseOrTouchMove);
      document.addEventListener("mousemove", onMouseMove);
    };

    // bind mouse and touch listeners
    if (type === "mouse") {
      document.addEventListener("mousemove", onMouseOrTouchMove);
      // clean up at end of interaction
      document.addEventListener("mouseup", cleanUp, { once: true });
    } else {
      document.addEventListener("touchmove", onMouseOrTouchMove);
      // clean up at end of interaction
      document.addEventListener("touchend", cleanUp, { once: true });
    }

    // remove mouse listener while mouse/touch down
    document.removeEventListener("mousemove", onMouseMove);
    MOUSE_POSITION.mapX = undefined;
    MOUSE_POSITION.mapY = undefined;
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onMouseOrTouchDown);
  document.addEventListener("touchstart", onMouseOrTouchDown);

  const onResize = () => {
    updateScreenDependentGlobals(coords);
    // runs animations pegged to camera movement
    camera.move(0, 0);
  };

  const observer = new ResizeObserver(onResize);
  observer.observe(ELEMENTS.canvasMap);
};
