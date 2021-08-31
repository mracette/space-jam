export interface EntityArgs {
  name?: string;
  hover?: boolean;
}

export class Entity {
  public name?: string;
  public hover?: boolean;
  constructor({ name = "", hover = false }: EntityArgs = {}) {
    this.name = name;
    this.hover = hover;
  }
}
