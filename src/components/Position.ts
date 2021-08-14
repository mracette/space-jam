export interface PositionArgs {
  x?: number;
  y?: number;
}

export class Position {
  constructor(public x: number = 0, public y: number = 0) {}
}
