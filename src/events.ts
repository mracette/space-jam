import { AUDIO_CTX } from "./index";
import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { OSCILLATOR_DEFINITIONS } from "./entities/oscillators/definitions";
import {
  updateScreenDependentGlobals,
  MOUSE_POSITION,
  ELEMENTS,
  COLORS,
  FONT_STYLE
} from "./globals";
import { clearCanvasAndState } from "./utils/canvas";
import { screenToMap } from "./utils/conversions";
import { MENU_VISIBLE, toggleMenu } from "./utils/dom";
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
    ELEMENTS.canvasOscillators,
    ELEMENTS.canvasInstruments,
    ELEMENTS.menu
  ].forEach((element) => {
    resizeWithAspectRatio(element, new AspectRatio(9, 16));
  });

  ELEMENTS.menuButton.onclick = toggleMenu;

  OSCILLATOR_DEFINITIONS.forEach((type) => {
    type.forEach((def) => {
      const button = document.createElement("button");
      const canvas = document.createElement("canvas");

      (ELEMENTS as any)[def.type].append(button);
      button.append(canvas);

      Object.assign(button.style, {
        width: "7.5vh",
        height: "7.5vh",
        background: COLORS.BACKGROUND
      });

      const observer = new ResizeObserver(() => {
        clearCanvasAndState(canvas);
        const ctx = canvas.getContext("2d");
        (def.class as any).renderBaseShape(
          ctx,
          canvas.width / 2,
          canvas.height / 1.75,
          canvas.width * def.buttonSize,
          canvas.width / 15,
          def.color
        );
        ctx.stroke();
        ctx.font = `${canvas.width / 5}px ${FONT_STYLE}`;
        ctx.fillStyle = COLORS.WHITE;
        ctx.textAlign = "center";
        const text = def.cost + "♪";
        const metrics = ctx.measureText(text);
        ctx.fillText(text, canvas.width / 2, metrics.actualBoundingBoxAscent * 1.75);
      });

      observer.observe(button);
    });
  });

  const onMouseMove = (e: MouseEvent) => {
    MOUSE_POSITION.screenX = e.x;
    MOUSE_POSITION.screenY = e.y;
    MOUSE_POSITION.mapX = screenToMap.x(e.x, coords, camera, ELEMENTS.canvasMap);
    MOUSE_POSITION.mapY = screenToMap.y(e.y, coords, camera, ELEMENTS.canvasMap);
  };

  const onMouseOrTouchDown = (e: MouseEvent | TouchEvent) => {
    AUDIO_CTX.resume();

    if (!MENU_VISIBLE) {
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
    }
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
