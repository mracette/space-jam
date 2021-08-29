export interface CacheItem {
  id: string;
  offscreen: {
    needsUpdate: boolean;
    canvas: HTMLCanvasElement;
  };
}

export const INSTRUMENT_CACHE: CacheItem[] = [
  {
    id: "in1",
    offscreen: {
      needsUpdate: true,
      canvas: document.createElement("canvas")
    }
  },
  {
    id: "in2",
    offscreen: {
      needsUpdate: true,
      canvas: document.createElement("canvas")
    }
  },
  {
    id: "in3",
    offscreen: {
      needsUpdate: true,
      canvas: document.createElement("canvas")
    }
  },
  {
    id: "in4",
    offscreen: {
      needsUpdate: true,
      canvas: document.createElement("canvas")
    }
  }
];
