export const clearCanvasAndState = (canvas: HTMLCanvasElement): void => {
  canvas.width = canvas.clientWidth * window.devicePixelRatio || 1;
  canvas.height = canvas.clientHeight * window.devicePixelRatio || 1;
};
