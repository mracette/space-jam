export const ELEMENTS = {
  // root
  root: document.getElementById("root") as HTMLDivElement,
  // canvas elements
  canvasTiles: document.getElementById("canvas-tiles") as HTMLCanvasElement,
  canvasPre: document.getElementById("canvas-pre") as HTMLCanvasElement,
  canvasPost: document.getElementById("canvas-post") as HTMLCanvasElement,
  canvasAudio: document.getElementById("canvas-audio") as HTMLCanvasElement,
  canvasStats: document.getElementById("canvas-stats") as HTMLCanvasElement,
  canvasOscillators: document.getElementById("canvas-oscillators") as HTMLCanvasElement,
  canvasInstruments: document.getElementById("canvas-instruments") as HTMLCanvasElement,
  // main menu
  menu: document.getElementById("menu") as HTMLDivElement,
  menuButton: document.getElementById("menu-button") as HTMLButtonElement,
  menuCol: document.getElementById("menu-col") as HTMLDivElement,
  menuNotes: document.getElementById("menu-notes") as HTMLParagraphElement,
  // hints
  hint: document.getElementById("hint") as HTMLParagraphElement,
  // inspect menu
  inspect: document.getElementById("inspect") as HTMLDivElement,
  inspectInner: document.getElementById("inner-inspect") as HTMLDivElement,
  inspectButton: document.getElementById("close-inspect") as HTMLButtonElement,
  inspectName: document.getElementById("inspect-name") as HTMLHeadingElement,
  inspectCost: document.getElementById("inspect-cost") as HTMLParagraphElement,
  inspectNotes: document.getElementById("inspect-notes") as HTMLParagraphElement,
  inspectSell: document.getElementById("inspect-sell") as HTMLParagraphElement,
  inspectSellButton: document.getElementById("sell-button") as HTMLButtonElement,
  // intro
  intro: document.getElementById("intro") as HTMLDivElement,
  start: document.getElementById("start") as HTMLButtonElement
};

export const CANVAS_CONTEXTS = {
  tiles: ELEMENTS.canvasTiles?.getContext("2d"),
  pre: ELEMENTS.canvasPre?.getContext("2d"),
  post: ELEMENTS.canvasPost?.getContext("2d"),
  stats: ELEMENTS.canvasStats?.getContext("2d"),
  audio: ELEMENTS.canvasAudio?.getContext("2d"),
  oscillator: ELEMENTS.canvasOscillators?.getContext("2d"),
  instrument: ELEMENTS.canvasInstruments?.getContext("2d")
};
