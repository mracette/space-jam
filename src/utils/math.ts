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
