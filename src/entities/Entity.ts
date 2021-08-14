export interface EntityArgs {
  name?: string;
}

let uuid = 0;

export class Entity {
  public name: string;
  public uuid: number;
  constructor({ name = "" }: EntityArgs) {
    this.name = name;
    this.uuid = uuid;
    uuid += 1;
  }
}
