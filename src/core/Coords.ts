export class CanvasCoordinates {
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  nx(n: number): number {
    return this.canvas.width * ((n + 1) / 2);
  }

  ny(n: number): number {
    return this.canvas.height * ((n + 1) / 2);
  }

  width(n: number): number {
    return this.canvas.width * n || 1;
  }

  height(n: number): number {
    return this.canvas.height * n || 1;
  }
}
