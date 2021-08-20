export class CanvasCoordinates {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
    this.canvas = canvas;
  }

  nx(n: number): number {
    return this.canvas.width * ((n + 1) / 2);
  }

  ny(n: number): number {
    return this.canvas.height * ((n + 1) / 2);
  }

  width(n = 1): number {
    return this.canvas.width * n;
  }

  height(n = 1): number {
    return this.canvas.height * n;
  }
}
