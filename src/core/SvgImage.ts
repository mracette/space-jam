export interface SvgImageArgs {
  dataUrl: string;
}

export class SvgImage {
  image: HTMLImageElement;
  constructor(public dataUrl: string) {
    this.image = new Image();
    this.image.src = dataUrl;
  }
}
