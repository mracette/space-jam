import { ELEMENTS } from "../globals";

export let MENU_VISIBLE = true;

export const toggleMenu = (): void => {
  if (ELEMENTS.menu.style.visibility === "hidden") {
    ELEMENTS.menu.style.visibility = "visible";
    ELEMENTS.menuButton.style.transform = "rotate(45deg)";
    MENU_VISIBLE = true;
  } else {
    ELEMENTS.menu.style.visibility = "hidden";
    ELEMENTS.menuButton.style.transform = "rotate(0deg)";
    MENU_VISIBLE = false;
  }
};
