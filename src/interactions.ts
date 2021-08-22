import { CAMERA } from "./index";
import { AnyInstrument } from "./entities/instruments/factories";
import { AnyOscillator } from "./entities/oscillators/factories";
import { MOUSE_POSITION } from "./globals";

export const dragEntityToMap = (
  entity: AnyInstrument | AnyOscillator,
  factory: (args: any) => AnyInstrument | AnyOscillator
): void => {
  entity.position.set(MOUSE_POSITION.mapX, MOUSE_POSITION.mapY);
  CAMERA.previewEntity = entity;

  const onMouseMove = () => {
    const x = Math.round(MOUSE_POSITION.mapX);
    const y = Math.round(MOUSE_POSITION.mapY);
    entity.position.set(x, y);
    entity.disabled = !entity.fitsInMap();
  };

  const placeEntityIfPossible = () => {
    if (!entity.disabled) {
      const { x, y } = entity.position;
      factory({ x, y });
      CAMERA.previewEntity = null;
      document.removeEventListener("mousemove", onMouseMove);
    } else {
      document.addEventListener("click", placeEntityIfPossible, { once: true });
    }
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("click", placeEntityIfPossible, { once: true });
};
