import { drawOutline } from "./drawing";

export const equilateralTriangle = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  side: number
): void => {
  const h = (side * Math.sqrt(3)) / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + side / 2, cy + h / 2);
  ctx.lineTo(cx - side / 2, cy + h / 2);
  ctx.closePath();
};

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
export const findBoundingBoxFromOutline = (outline: number[][]): BoundingBox => {
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;
  outline.forEach((point) => {
    const [x, y] = point;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });
  return {
    minX,
    maxX,
    minY,
    maxY
  };
};

/**
 * This function is in map coordinates using the top left of each
 * tile as the anchor point
 */
export const createShapeFromOutline = (
  ctx: CanvasRenderingContext2D,
  outline: number[][],
  boundingBox: BoundingBox
): number[][] => {
  const { minX, maxX, minY, maxY } = boundingBox;
  const shape = [];
  const p = new Path2D();
  drawOutline(p, outline);
  for (let i = minX; i < maxX; i++) {
    for (let j = minY; j < maxY; j++) {
      if (ctx.isPointInPath(p, i + 0.5, j + 0.5)) {
        shape.push([i, j + 1]);
      }
    }
  }
  return shape;
};
