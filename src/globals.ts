import { CanvasCoordinates } from "./core/Coords";

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

export const enum TILE_DIMENSIONS {
  SIZE = 0.05, // as a percentage of the canvas width
  HALF = 0.025 // as a percentage of the canvas width
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

export const COLORS = {
  CLEAR: "rgba(0,0,0,0)",
  WHITE: "#FFFFFF",
  BACKGROUND: "#272838",
  BACKGROUND_RGB: [39, 40, 56],
  MAIN_GREEN: "#5bba6f",
  MAIN_GREEN_RGB: [91, 186, 111],
  MAIN_PURPLE: "#7C77B9",
  MAIN_PURPLE_RGB: [124, 119, 185],
  HOT_PINK: "#ff4c7a",
  HOT_PINK_RGB: [255, 76, 122],
  HOT_BLUE: "#00f9ff",
  HOT_BLUE_RGB: [0, 249, 255]
};

export let GRADIENT_FOG: CanvasGradient;

export const TAU = Math.PI * 2;

export const enum SAMPLE_RATE {
  VALUE = 44100
}

export const enum LINE_WIDTH {
  VALUE = 0.006,
  HALF = 0.003
}

export const enum BPM {
  VALUE = 70,
  BPS = 70 / 60,
  SPB = 60 / 70
}

export const enum DURATIONS {
  WHOLE = BPM.SPB * 4,
  HALF = BPM.SPB * 2,
  QUARTER = BPM.SPB,
  QUARTER_TRIPLETS = (BPM.SPB * 2) / 3,
  EIGHT = BPM.SPB / 2,
  EIGHT_TRIPLETS = BPM.SPB / 2 / 3,
  SIXTEENTH = BPM.SPB / 4
}

export const enum ENTITY_STATE {
  PLAYING = "playing",
  STOPPED = "stopped"
}

export const STATS = {
  notes: 0
};

export const updateScreenDependentGlobals = (coords: CanvasCoordinates): void => {
  GRADIENT_FOG = CANVAS_CONTEXTS.post.createRadialGradient(
    coords.nx(0),
    coords.ny(0),
    coords.width((VIEWPORT_DIMENSIONS.W_HALF / 2) * TILE_DIMENSIONS.SIZE),
    coords.nx(0),
    coords.ny(0),
    coords.width(VIEWPORT_DIMENSIONS.W_HALF * TILE_DIMENSIONS.SIZE)
  );
  GRADIENT_FOG.addColorStop(0, COLORS.CLEAR);
  GRADIENT_FOG.addColorStop(0.25, COLORS.CLEAR);
  GRADIENT_FOG.addColorStop(1, COLORS.BACKGROUND);

  CANVAS_CONTEXTS.tiles.lineWidth = coords.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.post.lineWidth = coords.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.map.lineWidth = coords.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.stats.lineWidth = coords.width(LINE_WIDTH.VALUE);
  CANVAS_CONTEXTS.instruments.lineWidth = coords.width(LINE_WIDTH.VALUE);

  // draw fog and outer circle
  CANVAS_CONTEXTS.post.strokeStyle = COLORS.WHITE;
  CANVAS_CONTEXTS.post.fillStyle = GRADIENT_FOG;
  CANVAS_CONTEXTS.post.fillRect(0, 0, coords.width(), coords.height());
  CANVAS_CONTEXTS.post.beginPath();
  CANVAS_CONTEXTS.post.arc(
    coords.nx(0),
    coords.ny(0),
    coords.width(TILE_DIMENSIONS.SIZE * VIEWPORT_DIMENSIONS.W_HALF),
    0,
    TAU
  );
  CANVAS_CONTEXTS.post.stroke();
};

export const ELEMENTS = {
  canvasMap: document.getElementById("canvas-oscillators") as HTMLCanvasElement,
  canvasTiles: document.getElementById("canvas-tiles") as HTMLCanvasElement,
  canvasPost: document.getElementById("canvas-post") as HTMLCanvasElement,
  canvasStats: document.getElementById("canvas-stats") as HTMLCanvasElement,
  canvasOscillators: document.getElementById("canvas-oscillators") as HTMLCanvasElement,
  canvasInstruments: document.getElementById("canvas-instruments") as HTMLCanvasElement,
  menuButton: document.getElementById("menu-button") as HTMLButtonElement,
  menu: document.getElementById("menu") as HTMLDivElement,
  cOsc: document.getElementById("c-osc") as HTMLDivElement,
  tOsc: document.getElementById("t-osc") as HTMLDivElement,
  sOsc: document.getElementById("s-osc") as HTMLDivElement
};

export const CANVAS_CONTEXTS = {
  map: ELEMENTS.canvasMap.getContext("2d"),
  tiles: ELEMENTS.canvasTiles.getContext("2d"),
  post: ELEMENTS.canvasPost.getContext("2d"),
  stats: ELEMENTS.canvasStats.getContext("2d"),
  oscillators: ELEMENTS.canvasOscillators.getContext("2d"),
  instruments: ELEMENTS.canvasInstruments.getContext("2d")
};

CANVAS_CONTEXTS.tiles.fillStyle = COLORS.BACKGROUND;
CANVAS_CONTEXTS.tiles.strokeStyle = COLORS.WHITE;
CANVAS_CONTEXTS.instruments.strokeStyle = COLORS.WHITE;

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
    background: "rgba(0,0,0,.75)"
  },
  canvasTiles: {
    background: COLORS.BACKGROUND
  }
};

Object.entries(ELEMENTS).forEach(([k, v]) => {
  Object.assign(v.style, STYLES[k as keyof typeof STYLES]);
});

export const FONT_STYLE = '"Verdana", sans-serif';
