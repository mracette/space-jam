export interface VelocityArgs {
  x?: number;
  y?: number;
}

export class Velocity {
  constructor(public x: number = 0, public y: number = 0) {}
}
