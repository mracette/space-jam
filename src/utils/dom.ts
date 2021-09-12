import { abbreviateNumber } from "./math";
import { ELEMENTS } from "../globals/dom";
import { CAMERA, DEBUG, STATE, STATS } from "../globals/game";
import { handleOutsideClick, sellEntity } from "../interactions";

export const toggleMenu = (): void => {
  if (STATE.mainMenuHintVisible) {
    STATE.mainMenuHintVisible = false;
  }
  if (ELEMENTS.menu.style.visibility === "hidden") {
    ELEMENTS.menu.style.visibility = "visible";
    ELEMENTS.menuButton.style.transform = "rotate(0deg)";
    STATE.menuVisible = true;
    updateButtonDisabled();
    if (STATE.inspectVisible) {
      toggleInspect();
    }
    CAMERA.previewEntity = null;
    // using "mousedown" ensures that handleOutsideClick does not fire
    // when the menu is toggled open (on a click event)
    document.addEventListener("mousedown", handleOutsideClick);
  } else {
    ELEMENTS.menu.style.visibility = "hidden";
    ELEMENTS.menuButton.style.transform = "rotate(45deg)";
    STATE.menuVisible = false;
    document.removeEventListener("mousedown", handleOutsideClick);
  }
};

export const toggleInspect = (): void => {
  if (ELEMENTS.inspect.style.visibility === "hidden") {
    ELEMENTS.inspect.style.visibility = "visible";
    STATE.inspectVisible = true;
    updateInspectMenu();
    // using "mousedown" ensures that handleOutsideClick does not fire
    // when the menu is toggled open (on a click event)
    document.addEventListener("mousedown", handleOutsideClick);
  } else {
    ELEMENTS.inspect.style.visibility = "hidden";
    STATE.inspectVisible = false;
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
  ELEMENTS.menuNotes.innerHTML = "Notes: " + abbreviateNumber(STATS.currentNotes);
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
