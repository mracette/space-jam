import { CAMERA } from "./index";
import { AnyInstrument } from "./entities/instruments/factories";
import { AnyOscillator } from "./entities/oscillators/factories";
import { ELEMENTS } from "./globals/dom";
import { MOUSE_POSITION } from "./globals/sizes";

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
