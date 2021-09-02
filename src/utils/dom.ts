import { abbreviateNumber } from "./math";
import { ELEMENTS } from "../globals/dom";
import { DEBUG, STATS } from "../globals/game";
import { CAMERA } from "../index";
import { handleOutsideClick, sellEntity } from "../interactions";

export let MENU_VISIBLE = false;
export let INSPECT_VISIBLE = false;

export const toggleMenu = (): void => {
  if (ELEMENTS.menu.style.visibility === "hidden") {
    ELEMENTS.menu.style.visibility = "visible";
    ELEMENTS.menuButton.style.transform = "rotate(0deg)";
    MENU_VISIBLE = true;
    updateButtonDisabled();
    if (INSPECT_VISIBLE) {
      toggleInspect();
    }
    // using "mousedown" ensures that handleOutsideClick does not fire
    // when the menu is toggled open (on a click event)
    document.addEventListener("mousedown", handleOutsideClick);
  } else {
    ELEMENTS.menu.style.visibility = "hidden";
    ELEMENTS.menuButton.style.transform = "rotate(45deg)";
    MENU_VISIBLE = false;
    document.removeEventListener("mousedown", handleOutsideClick);
  }
};

export const toggleInspect = (): void => {
  if (ELEMENTS.inspect.style.visibility === "hidden") {
    ELEMENTS.inspect.style.visibility = "visible";
    INSPECT_VISIBLE = true;
    updateInspectMenu();
    // using "mousedown" ensures that handleOutsideClick does not fire
    // when the menu is toggled open (on a click event)
    document.addEventListener("mousedown", handleOutsideClick);
  } else {
    ELEMENTS.inspect.style.visibility = "hidden";
    INSPECT_VISIBLE = false;
    CAMERA.inspectEntity = null;
    document.removeEventListener("mousedown", handleOutsideClick);
  }
};

export const updateInspectMenu = (): void => {
  if (CAMERA.inspectEntity) {
    const sellAmount = Math.round(CAMERA.inspectEntity.cost / 3);
    ELEMENTS.inspectCost.innerHTML = abbreviateNumber(CAMERA.inspectEntity.cost);
    ELEMENTS.inspectName.innerHTML = CAMERA.inspectEntity.display;
    ELEMENTS.inspectNotes.innerHTML = abbreviateNumber(
      CAMERA.inspectEntity.notesProduced
    );
    ELEMENTS.inspectSell.innerHTML = abbreviateNumber(sellAmount);
  }
};

export const updateButtonDisabled = (): void => {
  if (DEBUG) return;
  document.querySelectorAll<HTMLButtonElement>(".entity-button").forEach((button) => {
    if (parseInt(button.getAttribute("cost")) <= STATS.currentNotes) {
      if (button.disabled) {
        button.disabled = false;
      }
    } else if (!button.disabled) {
      button.disabled = true;
    }
  });
};
