export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(n, max));

export const rotatePoint = (
  px: number,
  py: number,
  cx: number,
  cy: number,
  angle: number
): { x: number; y: number } => {
  return {
    x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
    y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
  };
};

export const lerp = (x0: number, x1: number, t: number): number => x0 * t + x1 * (1 - t);

export const abbreviateNumber = (n: number): string => {
  const m = n / 1000000;
  if (m > 1) {
    return m.toFixed(2) + "M";
  }
  const k = n / 1000;
  if (k > 1) {
    return k.toFixed(2) + "K";
  } else {
    return n + "";
  }
};
