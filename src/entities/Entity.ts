type EntityType = "instrument" | "oscillator" | "camera";

export interface EntityArgs {
  type?: EntityType;
  hover?: boolean;
}

export class Entity {
  public type?: EntityType;
  public hover?: boolean;
  constructor({ type, hover = false }: EntityArgs = {}) {
    this.type = type;
    this.hover = hover;
  }
}
