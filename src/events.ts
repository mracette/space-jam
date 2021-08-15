import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { updateScreenDependentGlobals, MOUSE_POSITION } from "./globals";
import { screenToMap } from "./utils/conversions";
import {
  getEventType,
  getMouseOrTouchPosition,
  resizeWithAspectRatio,
  calculatePositionDelta
} from "./utils/events";

export const initializeEventListeners = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  coords: CanvasCoordinates,
  camera: Camera
): void => {
  resizeWithAspectRatio(canvas, new AspectRatio(9, 16));

  const onMouseMove = (e: MouseEvent) => {
    MOUSE_POSITION.screenX = e.x;
    MOUSE_POSITION.screenY = e.y;
    MOUSE_POSITION.mapX = screenToMap.x(e.x, coords, camera, canvas);
    MOUSE_POSITION.mapY = screenToMap.y(e.y, coords, camera, canvas);
  };

  const onMouseOrTouchDown = (e: MouseEvent | TouchEvent) => {
    const { x: xStart, y: yStart } = getMouseOrTouchPosition(e);
    const type = getEventType(e);

    const onMouseOrTouchMove = (e: MouseEvent | TouchEvent) => {
      const { x, y } = calculatePositionDelta(
        e,
        canvas.clientWidth,
        xStart,
        canvas.clientHeight,
        yStart
      );
      camera.position.x -= 2 * x;
      camera.position.y += 2 * y;
      camera.updateEntityArrayBounds();
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
    updateScreenDependentGlobals(ctx, coords);
  };

  const observer = new ResizeObserver(onResize);
  observer.observe(canvas);
};
