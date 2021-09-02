import { CAMERA, EntityArrayElement, ENTITY_ARRAY } from "./index";
import { AnyInstrument } from "./entities/instruments/factories";
import { AnyOscillator } from "./entities/oscillators/factories";
import { AUDIO } from "./globals/audio";
import { ELEMENTS } from "./globals/dom";
import { STATS } from "./globals/game";
import { MOUSE_POSITION, TILE_DIMENSIONS } from "./globals/sizes";
import { isUndefined, mapToEntityArray, screenToMap } from "./utils/conversions";
import { INSPECT_VISIBLE, MENU_VISIBLE, toggleInspect, toggleMenu } from "./utils/dom";
import { drawFog, drawStarPattern } from "./utils/drawing";

export const sellEntity = (): void => {
  if (CAMERA.inspectEntity) {
    CAMERA.inspectEntity.removeFromMap();
    STATS.currentNotes += CAMERA.inspectEntity.sell;
    STATS.totalNotes += CAMERA.inspectEntity.sell;
    toggleInspect();
  }
};

export const handleResize = (): void => {
  drawStarPattern();
  drawFog();
  CAMERA.updateViewport();
};

export const handleOutsideClick = (e: MouseEvent): void => {
  if (
    MENU_VISIBLE &&
    !ELEMENTS.menu.contains(e.target as Element) &&
    !ELEMENTS.menuButton.contains(e.target as Element)
  ) {
    toggleMenu();
  }
  if (INSPECT_VISIBLE && !ELEMENTS.inspectInner.contains(e.target as Element)) {
    toggleInspect();
  }
};

export const closeMenu = (e: KeyboardEvent): void => {
  if (e.key === "Escape" && MENU_VISIBLE) {
    toggleMenu();
  }
};

export const closeInspect = (e: KeyboardEvent): void => {
  if (e.key === "Escape" && INSPECT_VISIBLE) {
    toggleInspect();
  }
};

export const updateMousePosition = (e: MouseEvent): void => {
  MOUSE_POSITION.screenX = e.x;
  MOUSE_POSITION.screenY = e.y;
  MOUSE_POSITION.mapX = screenToMap.x(e.x);
  MOUSE_POSITION.mapY = screenToMap.y(e.y);
};

export const moveCamera = (e: MouseEvent): void => {
  AUDIO.context.resume();

  if (!MENU_VISIBLE && !INSPECT_VISIBLE) {
    const tileSizePixels = ELEMENTS.canvasTiles.clientWidth * TILE_DIMENSIONS.SIZE;
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

export const clickMouseOverEntity = (e: MouseEvent): void => {
  if (CAMERA.inspectEntity && !INSPECT_VISIBLE) {
    toggleInspect();
  }
};

export const checkMouseoverEntity = (): EntityArrayElement => {
  if (MENU_VISIBLE || INSPECT_VISIBLE) {
    return undefined;
  }
  if (isUndefined(MOUSE_POSITION.mapX) || isUndefined(MOUSE_POSITION.mapY)) {
    return undefined;
  }
  const arrX = mapToEntityArray.x(MOUSE_POSITION.mapX);
  const arrY = mapToEntityArray.y(MOUSE_POSITION.mapY);
  if (isUndefined(arrX) || isUndefined(arrY)) {
    return undefined;
  }
  const entity = ENTITY_ARRAY[arrX][arrY];
  CAMERA.inspectEntity = entity.entity;
  if (entity.entity) {
    ELEMENTS.canvasStats.style.cursor = "pointer";
  } else {
    ELEMENTS.canvasStats.style.cursor = "grab";
  }
  return entity;
};

document.addEventListener("mousedown", clickMouseOverEntity, { capture: false });
document.addEventListener("mousemove", checkMouseoverEntity, { capture: false });

export const dragEntityToMap = (
  entity: AnyInstrument | AnyOscillator,
  factory: (args: any) => AnyInstrument | AnyOscillator
): void => {
  entity.position.set(MOUSE_POSITION.mapX, MOUSE_POSITION.mapY);
  CAMERA.previewEntity = entity;
  ELEMENTS.canvasStats.style.cursor = "pointer";

  const onMouseMove = () => {
    const x = MOUSE_POSITION.mapX;
    const y = MOUSE_POSITION.mapY;
    if (typeof x !== "undefined" && typeof y !== "undefined") {
      entity.position.set(x, y);
      entity.disabled = !entity.fitsInMap();
    }
  };

  const placeEntityIfPossible = () => {
    if (!entity.disabled) {
      const { x, y } = entity.position;
      factory({ x, y });
      STATS.currentNotes -= CAMERA.previewEntity.cost;
      CAMERA.previewEntity = null;
      document.removeEventListener("mousemove", onMouseMove);
      ELEMENTS.canvasStats.style.cursor = "grab";
    } else {
      document.addEventListener("click", placeEntityIfPossible, { once: true });
    }
  };

  const cancelEntityPlacement = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      CAMERA.previewEntity = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", placeEntityIfPossible);
      ELEMENTS.canvasStats.style.cursor = "grab";
    }
  };

  document.addEventListener("keydown", cancelEntityPlacement);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("click", placeEntityIfPossible, { once: true });
};
