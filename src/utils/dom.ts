import { ELEMENTS } from "../globals";

export let MENU_VISIBLE = false;

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
