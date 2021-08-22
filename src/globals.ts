import { AspectRatio } from "./core/AspectRatio";
import { COLORS } from "./globals/colors";

const enum MAP_DIMENSION {
  SIZE = 255 // must be odd
}

export const enum MAP_DIMENSIONS {
  W = MAP_DIMENSION.SIZE,
  W_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  H = MAP_DIMENSION.SIZE,
  H_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  MIN_X = -(MAP_DIMENSION.SIZE - 1) / 2,
  MAX_X = (MAP_DIMENSION.SIZE - 1) / 2,
  MIN_Y = -(MAP_DIMENSION.SIZE - 1) / 2,
  MAX_Y = (MAP_DIMENSION.SIZE - 1) / 2
}

const enum VIEWPORT_DIMENSION {
  SIZE = 19 // must be odd
}
export const enum VIEWPORT_DIMENSIONS {
  W = VIEWPORT_DIMENSION.SIZE,
  H = VIEWPORT_DIMENSION.SIZE,
  W_HALF = (VIEWPORT_DIMENSION.SIZE - 1) / 2,
  H_HALF = (VIEWPORT_DIMENSION.SIZE - 1) / 2
}

export const enum ENTITY_ARRAY_DIMENSIONS {
  W = MAP_DIMENSION.SIZE,
  W_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  H = MAP_DIMENSION.SIZE,
  H_HALF = (MAP_DIMENSION.SIZE - 1) / 2,
  MIN_X = 0,
  MAX_X = MAP_DIMENSION.SIZE - 1,
  MIN_Y = 0,
  MAX_Y = MAP_DIMENSION.SIZE - 1
}

// as a percentage of the canvas width
export const enum TILE_DIMENSIONS {
  SIZE = 0.05,
  HALF = 0.025,
  QUARTER = 0.0125
}

export const MOUSE_POSITION: {
  screenX: number;
  screenY: number;
  mapX: number;
  mapY: number;
} = {
  screenX: undefined,
  screenY: undefined,
  mapX: undefined,
  mapY: undefined
};

export let GRADIENT_FOG: CanvasGradient;

export const TAU = Math.PI * 2;

export const enum SAMPLE_RATE {
  VALUE = 44100
}

export const enum LINE_WIDTH {
  VALUE = 0.006,
  HALF = 0.003,
  DOUBLE = 0.012
}

export const enum BPM {
  VALUE = 70,
  BPS = 70 / 60,
  SPB = 60 / 70
}

export const enum DURATIONS {
  WHOLE = BPM.SPB * 4,
  WHOLE_TRIPLETS = (BPM.SPB * 8) / 3,
  HALF = BPM.SPB * 2,
  HALF_TRIPLETS = (BPM.SPB * 4) / 3,
  QUARTER = BPM.SPB,
  QUARTER_TRIPLETS = (BPM.SPB * 2) / 3,
  EIGHTH = BPM.SPB / 2,
  EIGHTH_TRIPLETS = BPM.SPB / 2 / 3,
  SIXTEENTH = BPM.SPB / 4
}

export const enum ENTITY_STATE {
  PLAYING = "playing",
  STOPPED = "stopped"
}

export const STATS = {
  notes: 100
};

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
  co: document.getElementById("co") as HTMLDivElement,
  to: document.getElementById("to") as HTMLDivElement,
  so: document.getElementById("so") as HTMLDivElement,
  t1: document.getElementById("t1") as HTMLDivElement
};

export const CANVAS_CONTEXTS = {
  tiles: ELEMENTS.canvasTiles.getContext("2d"),
  pre: ELEMENTS.canvasPost.getContext("2d"),
  post: ELEMENTS.canvasPost.getContext("2d"),
  stats: ELEMENTS.canvasStats.getContext("2d"),
  oscillator: ELEMENTS.canvasOscillators.getContext("2d"),
  instrument: ELEMENTS.canvasInstruments.getContext("2d")
};

export const STYLES = {
  menuButton: {
    margin: "20px",
    border: "1px solid white",
    position: "absolute",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    fontSize: "24px",
    alignSelf: "flex-end",
    transitionDuration: "250ms"
  },
  menu: {
    // visibility: "hidden",
    background: "rgba(0,0,0,.75)",
    justifyContent: "flex-start"
  },
  menuCol: {
    justifyContent: "flex-start"
  },
  canvasPre: {
    background: COLORS.BACKGROUND
  },
  co: {
    width: "unset"
  },
  to: {
    width: "unset"
  },
  so: {
    width: "unset"
  }
};

Object.entries(ELEMENTS).forEach(([k, v]) => {
  Object.assign(v.style, STYLES[k as keyof typeof STYLES]);
});

document.body.style.background = "black";
// document.body.style.background = COLORS.BACKGROUND;

export const FONT_STYLE = '"Verdana", sans-serif';

export const ASPECT_RATIO = new AspectRatio(9, 16);
