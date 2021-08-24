export interface CacheItem {
  id: string;
  offscreen: {
    needsUpdate: boolean;
    canvas: HTMLCanvasElement;
  };
}

export const INSTRUMENT_CACHE: CacheItem[] = [
  {
    id: "t11",
    offscreen: {
      needsUpdate: true,
      canvas: document.createElement("canvas")
    }
  },
  {
    id: "t12",
    offscreen: {
      needsUpdate: true,
      canvas: document.createElement("canvas")
    }
  },
  {
    id: "t13",
    offscreen: {
      needsUpdate: true,
      canvas: document.createElement("canvas")
    }
  }
];
