export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(n, max));
