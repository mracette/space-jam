export interface Vector2Args {
  x?: number;
  y?: number;
}

export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}
  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
  sum(): number {
    return this.x + this.y;
  }
}
