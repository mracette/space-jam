import { CAMERA, EntityArrayElement, ENTITY_ARRAY } from "./index";
import { AnyInstrument } from "./entities/instruments/factories";
import { AnyOscillator } from "./entities/oscillators/factories";
import { ELEMENTS } from "./globals/dom";
import { MOUSE_POSITION } from "./globals/sizes";
import { isUndefined, mapToEntityArray } from "./utils/conversions";
import { INSPECT_VISIBLE, MENU_VISIBLE, toggleInspect } from "./utils/dom";

export const clickMouseOverEntity = (e: MouseEvent) => {
  console.log(e.target);
  if (CAMERA.inspectEntity && !INSPECT_VISIBLE) {
    console.log(CAMERA?.inspectEntity);
    console.log("teskljdsflks");
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
