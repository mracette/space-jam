import { CAMERA } from "./index";
import {
  OSCILLATOR_CLASSES,
  OSCILLATOR_DEFINITIONS
} from "./entities/oscillators/definitions";
import { MOUSE_POSITION } from "./globals";

export const dragOscillatorToMap = (
  oscillator: typeof OSCILLATOR_DEFINITIONS[number],
  constructor: typeof OSCILLATOR_CLASSES[number]
): void => {
  oscillator.position.set(MOUSE_POSITION.mapX, MOUSE_POSITION.mapY);
  CAMERA.previewEntity = oscillator;

  const onMouseMove = () => {
    const x = Math.round(MOUSE_POSITION.mapX);
    const y = Math.round(MOUSE_POSITION.mapY);
    oscillator.position.set(x, y);
    oscillator.disabled = !oscillator.fitsInMap();
  };

  const placeEntityIfPossible = () => {
    if (!oscillator.disabled) {
      const { x, y } = oscillator.position;
      new constructor({ x, y });
      CAMERA.previewEntity = null;
      document.removeEventListener("mousemove", onMouseMove);
    } else {
      document.addEventListener("click", placeEntityIfPossible, { once: true });
    }
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("click", placeEntityIfPossible, { once: true });
};
