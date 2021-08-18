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
