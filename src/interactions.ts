import { Camera } from "./entities/Camera";
import { OSCILLATOR_DEFINITIONS } from "./entities/oscillators/definitions";
import { Oscillator } from "./entities/oscillators/Oscillator";
import { ELEMENTS, MOUSE_POSITION } from "./globals";
import { screenToMap } from "./utils/conversions";

export const dragOscillatorToMap = (
  oscillator: typeof OSCILLATOR_DEFINITIONS[number]
): void => {
  const onMouseMove = () => {
    const x = Math.round(MOUSE_POSITION.mapX);
    const y = Math.round(MOUSE_POSITION.mapY);
    oscillator.position.x = x;
    oscillator.position.y = y;
    // @ts-ignore
    oscillator.disabled = !oscillator.fitsInMap(x, y);
    oscillator.render();
  };

  const placeEntityIfPossible = () => {
    if (!oscillator.disabled) {
      const px = oscillator.position.x;
      const py = oscillator.position.y;
      // oscillator.move(px, py);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("click", placeEntityIfPossible, { once: true });
};
