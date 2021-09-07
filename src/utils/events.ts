import { CAMERA } from "../globals/game";
import { ASPECT_RATIO } from "../globals/sizes";

export const getEventType = (e: MouseEvent | TouchEvent): "touch" | "mouse" | "click" => {
  if (e.type.startsWith("touch")) {
    return "touch";
  } else if (e.type.startsWith("mouse")) {
    return "mouse";
  } else if (e.type.startsWith("click")) {
    return "click";
  }
};

export const resizeWithAspectRatio = (element: HTMLElement | HTMLCanvasElement): void => {
  const parent = element.parentElement;
  const resizeToAspectRatio = () => {
    const { width, height } = parent.getBoundingClientRect();
    const resizeRatio = Math.min(width / ASPECT_RATIO.x, height / ASPECT_RATIO.y);
    const newWidth = resizeRatio * ASPECT_RATIO.x;
    const newHeight = resizeRatio * ASPECT_RATIO.y;
    const dpr = window.devicePixelRatio || 1;
    (element as HTMLCanvasElement).width = newWidth * dpr;
    (element as HTMLCanvasElement).height = newHeight * dpr;
    element.style.width = newWidth + "px";
    element.style.height = newHeight + "px";
    CAMERA.updateViewport();
  };

  const observer = new ResizeObserver(resizeToAspectRatio);
  observer.observe(parent);
};
