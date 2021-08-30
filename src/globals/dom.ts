export const ELEMENTS = {
  canvasTiles: document.getElementById("canvas-tiles") as HTMLCanvasElement,
  canvasPre: document.getElementById("canvas-pre") as HTMLCanvasElement,
  canvasPost: document.getElementById("canvas-post") as HTMLCanvasElement,
  canvasStats: document.getElementById("canvas-stats") as HTMLCanvasElement,
  canvasOscillators: document.getElementById("canvas-oscillators") as HTMLCanvasElement,
  canvasInstruments: document.getElementById("canvas-instruments") as HTMLCanvasElement,
  menuButton: document.getElementById("menu-button") as HTMLButtonElement,
  menuCol: document.getElementById("menu-col") as HTMLDivElement,
  menu: document.getElementById("menu") as HTMLDivElement,
  os: document.getElementById("os") as HTMLDivElement,
  in: document.getElementById("in") as HTMLDivElement
};

export const CANVAS_CONTEXTS = {
  tiles: ELEMENTS.canvasTiles.getContext("2d"),
  pre: ELEMENTS.canvasPost.getContext("2d"),
  post: ELEMENTS.canvasPost.getContext("2d"),
  stats: ELEMENTS.canvasStats.getContext("2d"),
  oscillator: ELEMENTS.canvasOscillators.getContext("2d"),
  instrument: ELEMENTS.canvasInstruments.getContext("2d")
};
