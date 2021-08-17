import { AspectRatio } from "../core/AspectRatio";

export const getEventType = (e: MouseEvent | TouchEvent): "touch" | "mouse" => {
  if (e.type.startsWith("touch")) {
    return "touch";
  } else if (e.type.startsWith("mouse")) {
    return "mouse";
  }
};

export const getMouseOrTouchPosition = (
  event: MouseEvent | TouchEvent
): { x: number; y: number } => {
  let x: number;
  let y: number;
  const type = getEventType(event);
  if (type === "touch") {
    const touchEvent = event as TouchEvent;
    x = touchEvent?.touches[0].clientX;
    y = touchEvent?.touches[0].clientY;
  } else if (type === "mouse") {
    const mouseEvent = event as MouseEvent;
    x = mouseEvent.clientX;
    y = mouseEvent.clientY;
  }
  return { x, y };
};

export const calculatePositionDelta = (
  event: MouseEvent | TouchEvent,
  width: number,
  startX: number,
  height: number,
  startY: number
): { x: number; y: number } => {
  const { x, y } = getMouseOrTouchPosition(event);
  return {
    x: (x - startX) / width,
    y: (y - startY) / height
  };
};

export const resizeWithAspectRatio = (
  element: HTMLElement | HTMLCanvasElement,
  ratio: AspectRatio
): void => {
  const parent = element.parentElement;
  const resize = () => {
    const { width, height } = parent.getBoundingClientRect();
    const resizeRatio = Math.min(width / ratio.x, height / ratio.y);
    const newWidth = resizeRatio * ratio.x;
    const newHeight = resizeRatio * ratio.y;
    const dpr = window.devicePixelRatio || 1;
    (element as HTMLCanvasElement).width = newWidth * dpr;
    (element as HTMLCanvasElement).height = newHeight * dpr;
    element.style.width = newWidth + "px";
    element.style.height = newHeight + "px";
  };

  const observer = new ResizeObserver(resize);
  observer.observe(parent);
};
