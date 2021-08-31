import { INSTRUMENT_LIST } from "../entities/instruments/factories";
import { OSCILLATOR_LIST } from "../entities/oscillators/factories";
import { ELEMENTS } from "../globals/dom";
import { DEBUG, STATS } from "../globals/game";
import { CAMERA } from "../index";

export let MENU_VISIBLE = false;
export let INSPECT_VISIBLE = false;

export const toggleMenu = (): void => {
  console.log("toggling menu");
  if (ELEMENTS.menu.style.visibility === "hidden") {
    ELEMENTS.menu.style.visibility = "visible";
    ELEMENTS.menuButton.style.transform = "rotate(45deg)";
    MENU_VISIBLE = true;
    updateButtonDisabled();
    if (INSPECT_VISIBLE) {
      toggleInspect();
    }
  } else {
    ELEMENTS.menu.style.visibility = "hidden";
    ELEMENTS.menuButton.style.transform = "rotate(0deg)";
    MENU_VISIBLE = false;
  }
};

export const toggleInspect = (): void => {
  console.log("toggling inspect");
  if (ELEMENTS.inspect.style.visibility === "hidden") {
    ELEMENTS.inspect.style.visibility = "visible";
    INSPECT_VISIBLE = true;
  } else {
    ELEMENTS.inspect.style.visibility = "hidden";
    INSPECT_VISIBLE = false;
    CAMERA.inspectEntity = null;
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
