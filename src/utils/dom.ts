import { INSTRUMENT_LIST } from "../entities/instruments/factories";
import { OSCILLATOR_LIST } from "../entities/oscillators/factories";
import { ELEMENTS } from "../globals/dom";
import { DEBUG, STATS } from "../globals/game";

export let MENU_VISIBLE = false;

export const toggleMenu = (): void => {
  if (ELEMENTS.menu.style.visibility === "hidden") {
    ELEMENTS.menu.style.visibility = "visible";
    ELEMENTS.menuButton.style.transform = "rotate(45deg)";
    MENU_VISIBLE = true;
    updateButtonDisabled();
  } else {
    ELEMENTS.menu.style.visibility = "hidden";
    ELEMENTS.menuButton.style.transform = "rotate(0deg)";
    MENU_VISIBLE = false;
  }
};

export const abbreviateNumber = (n: number): string => {
  const m = n / 1000000;
  if (m > 1) {
    return m + "M";
  }
  const k = n / 1000;
  if (k > 1) {
    return k + "K";
  } else {
    return n + "";
  }
};

export const updateButtonDisabled = (): void => {
  if (DEBUG) return;
  [...INSTRUMENT_LIST, ...OSCILLATOR_LIST].forEach((entity) => {
    const button = document.getElementById(entity.id) as HTMLButtonElement;
    if (entity.cost <= STATS.notes) {
      if (button.disabled) {
        button.disabled = false;
      }
    } else if (!button.disabled) {
      button.disabled = true;
    }
  });
};
