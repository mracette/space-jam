export interface CacheItem {
  id: string;
  offscreen: {
    needsUpdate: boolean;
    canvas: OffscreenCanvas;
  };
}

export const INSTRUMENT_CACHE: CacheItem[] = [
  {
    id: "t11",
    offscreen: {
      needsUpdate: true,
      canvas: new OffscreenCanvas(0, 0)
    }
  },
  {
    id: "t12",
    offscreen: {
      needsUpdate: true,
      canvas: new OffscreenCanvas(0, 0)
    }
  },
  {
    id: "t13",
    offscreen: {
      needsUpdate: true,
      canvas: new OffscreenCanvas(0, 0)
    }
  }
];
