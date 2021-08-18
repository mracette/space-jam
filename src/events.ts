import { AUDIO_CTX, EntityArrayElement, ENTITY_ARRAY, PREVIEW_ENTITY } from "./index";
import { Position } from "./components/Position";
import { AspectRatio } from "./core/AspectRatio";
import { CanvasCoordinates } from "./core/Coords";
import { Camera } from "./entities/Camera";
import { OSCILLATOR_DEFINITIONS } from "./entities/oscillators/definitions";
import { Oscillator } from "./entities/oscillators/Oscillator";
import {
  updateScreenDependentGlobals,
  MOUSE_POSITION,
  ELEMENTS,
  COLORS,
  FONT_STYLE
} from "./globals";
import { clearCanvasAndState } from "./utils/canvas";
import { mapToEntityArray, mapToScreen, screenToMap } from "./utils/conversions";
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

      button.onclick = (e: MouseEvent | TouchEvent) => {
        const { x, y } = getMouseOrTouchPosition(e);
        // @ts-ignore
        PREVIEW_ENTITY.entity = new def.class({
          x: screenToMap.x(x, coords, camera, ELEMENTS.canvasOscillators),
          y: screenToMap.y(y, coords, camera, ELEMENTS.canvasOscillators)
        });
        PREVIEW_ENTITY.screen = new Position(x, y);
        toggleMenu();

        const previewEntityOnMouseMove = () => {
          const x = Math.round(MOUSE_POSITION.mapX);
          const y = Math.round(MOUSE_POSITION.mapY);
          PREVIEW_ENTITY.entity.position.x = x;
          PREVIEW_ENTITY.entity.position.y = y;
          PREVIEW_ENTITY.entity.disabled = !Oscillator.fitsInMap(x, y);
        };

        const placeEntityIfPossible = () => {
          if (!PREVIEW_ENTITY.entity.disabled) {
            const px = PREVIEW_ENTITY.entity.position.x;
            const py = PREVIEW_ENTITY.entity.position.y;
            PREVIEW_ENTITY.entity.move(px, py);
            PREVIEW_ENTITY.entity = null;
            document.removeEventListener("mousemove", previewEntityOnMouseMove);
          } else {
            document.addEventListener("mousedown", placeEntityIfPossible, { once: true });
          }
        };

        document.addEventListener("mousemove", previewEntityOnMouseMove);
        document.addEventListener("mousedown", placeEntityIfPossible, { once: true });
      };

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
    MOUSE_POSITION.mapX = screenToMap.x(e.x, coords, camera, ELEMENTS.canvasStats);
    MOUSE_POSITION.mapY = screenToMap.y(e.y, coords, camera, ELEMENTS.canvasStats);
  };

  const onMouseOrTouchDown = (e: MouseEvent | TouchEvent) => {
    AUDIO_CTX.resume();

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
  observer.observe(ELEMENTS.canvasTiles);
};
