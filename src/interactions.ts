import { begin } from "./index";
import { InstrumentFactory } from "./entities/instruments/factories";
import { Instrument } from "./entities/instruments/Instrument";
import { OscillatorFactory } from "./entities/oscillators/factories";
import { Oscillator } from "./entities/oscillators/Oscillator";
import { AUDIO } from "./globals/audio";
import { ELEMENTS } from "./globals/dom";
import { CAMERA, EntityArrayElement, ENTITY_ARRAY, STATE, STATS } from "./globals/game";
import { MOUSE_POSITION, TILE_DIMENSIONS } from "./globals/sizes";
import { updateSpatialEffects } from "./utils/audio";
import { isUndefined, mapToEntityArray, screenToMap } from "./utils/conversions";
import { toggleHintText, toggleInspect, toggleMenu } from "./utils/dom";
import { drawFog, drawStarPattern } from "./utils/drawing";

export const startGame = (): void => {
  const introElements = document.querySelectorAll<HTMLElement>(".hide-intro");
  introElements.forEach((el) => {
    el.style.opacity = "1";
  });
  ELEMENTS.intro.style.transform = "translate(0, -100%)";
  window.setTimeout(() => {
    begin();
    // these durations cause issues with regular re-sizing
    introElements.forEach((el) => (el.style.transitionDuration = "0ms"));
  }, 1000);
};

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
    STATE.menuVisible &&
    !ELEMENTS.menu.contains(e.target as Element) &&
    !ELEMENTS.menuButton.contains(e.target as Element)
  ) {
    toggleMenu();
  }
  if (STATE.inspectVisible && !ELEMENTS.inspectInner.contains(e.target as Element)) {
    toggleInspect();
  }
};

export const closeMenu = (e: KeyboardEvent): void => {
  if (e.key === "Escape" && STATE.menuVisible) {
    toggleMenu();
  }
};

export const closeInspect = (e: KeyboardEvent): void => {
  if (e.key === "Escape" && STATE.inspectVisible) {
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
  if (!STATE.menuVisible && !STATE.inspectVisible) {
    const tileSizePixels = ELEMENTS.canvasTiles.clientWidth * TILE_DIMENSIONS.SIZE;
    let xStart = e.clientX;
    let yStart = e.clientY;
    const { x: xCameraStart, y: yCameraStart } = CAMERA.position;
    const updateCameraPosition = (e: MouseEvent) => {
      if (STATE.hints.drag) {
        toggleHintText("hide");
      }
      const dx = e.clientX - xStart;
      const dy = e.clientY - yStart;
      CAMERA.position.set(
        xCameraStart - dx / tileSizePixels,
        yCameraStart + dy / tileSizePixels
      );
      CAMERA.updateViewport();
      for (
        let i = CAMERA.entityArrayBounds.xLower;
        i <= CAMERA.entityArrayBounds.xUpper;
        i++
      ) {
        for (
          let j = CAMERA.entityArrayBounds.yLower;
          j <= CAMERA.entityArrayBounds.yUpper;
          j++
        ) {
          const entity = ENTITY_ARRAY[i][j]?.entity;
          if (entity?.type === "instrument") {
            updateSpatialEffects(entity as Instrument);
          }
        }
      }
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

export const clickMouseOverEntity = (): void => {
  if (CAMERA.inspectEntity && !STATE.inspectVisible && !CAMERA.previewEntity) {
    toggleInspect();
  }
};

export const checkMouseoverEntity = (): EntityArrayElement => {
  if (STATE.menuVisible || STATE.inspectVisible) {
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
  } else if (!CAMERA.previewEntity) {
    ELEMENTS.canvasStats.style.cursor = "grab";
  }
  return entity;
};

export const dragEntityToMap = (
  entity: Instrument | Oscillator,
  factory: InstrumentFactory | OscillatorFactory
): void => {
  if (STATE.showEscapeHints) {
    toggleHintText("escape");
  }

  entity.position.set(MOUSE_POSITION.mapX, MOUSE_POSITION.mapY);
  CAMERA.previewEntity = entity;
  ELEMENTS.canvasStats.style.cursor = "pointer";

  let sx: number, sy: number;

  const onMouseDown = (e: MouseEvent) => {
    ELEMENTS.canvasStats.style.cursor = "grab";
    sx = e.x;
    sy = e.y;
  };

  const onMouseMove = () => {
    const x = MOUSE_POSITION.mapX;
    const y = MOUSE_POSITION.mapY;
    if (typeof x !== "undefined" && typeof y !== "undefined") {
      entity.position.set(x, y);
      const blocked = !entity.fitsInMap();
      entity.disabled = blocked;
      if (blocked) {
        ELEMENTS.canvasStats.style.cursor = "not-allowed";
      } else {
        ELEMENTS.canvasStats.style.cursor = "pointer";
      }
    }
  };

  const placeEntityIfPossible = (e: MouseEvent) => {
    const dx = Math.abs(e.x - sx);
    const dy = Math.abs(e.y - sy);
    // check if this is a "click-and-drag" event, and bypass the regular "click" handler if so
    if (dx > 5 || dy > 5) {
      document.addEventListener("click", placeEntityIfPossible, { once: true });
      ELEMENTS.canvasStats.style.cursor = "pointer";
      return;
    }
    if (entity.disabled) {
      document.addEventListener("click", placeEntityIfPossible, { once: true });
    } else {
      toggleHintText("hide");
      STATE.entitiesPlaced += 1;
      const { x, y } = entity.position;
      factory({ x, y });
      STATS.currentNotes -= CAMERA.previewEntity.cost;
      CAMERA.previewEntity = null;
      document.removeEventListener("mousemove", onMouseMove);
      ELEMENTS.canvasStats.style.cursor = "grab";
      if (STATE.entitiesPlaced === 2) {
        toggleHintText("drag");
      }
    }
  };

  const cancelEntityPlacement = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      toggleHintText("hide");
      STATE.showEscapeHints = false;
      entity.disabled = true;
      CAMERA.previewEntity = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", placeEntityIfPossible);
      ELEMENTS.canvasStats.style.cursor = "grab";
    }
  };

  document.addEventListener("keydown", cancelEntityPlacement);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", placeEntityIfPossible, { once: true });
};
