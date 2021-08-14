import { AspectRatio } from "../core/AspectRatio";

export const resizeWithAspectRatio = (
  canvas: HTMLCanvasElement,
  ratio: AspectRatio
): void => {
  const parent = canvas.parentElement;
  const resize = () => {
    const { width, height } = parent.getBoundingClientRect();
    const resizeRatio = Math.min(width / ratio.x, height / ratio.y);
    const newWidth = resizeRatio * ratio.x;
    const newHeight = resizeRatio * ratio.y;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = newWidth * dpr;
    canvas.height = newHeight * dpr;
    canvas.style.width = newWidth + "px";
    canvas.style.height = newHeight + "px";
  };

  const observer = new ResizeObserver(resize);
  observer.observe(parent);
};
