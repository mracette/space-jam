import { CanvasCoordinates } from "../src/core/Coords";
import { COLORS } from "../src/globals/colors";
import { lerp, rotatePoint } from "../src/utils/math";

console.log("test");

const TAU = Math.PI * 2;

const canvas = document.createElement("canvas");
canvas.style.background = COLORS.BACKGROUND;
canvas.className = "fill-absolute";
const ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

const coords = new CanvasCoordinates(canvas);

const draw = (ctx: CanvasRenderingContext2D) => {
  const CIRCLE_SIZE = 0.01;
  const HSL_BAND = [50, 300];
  console.log("draw");
  ctx.fillStyle = "white";
  const numCircles = 50;
  const overallRadius = coords.width(0.2);
  const circleDistance = overallRadius / numCircles;
  const dotSize = circleDistance / 5;
  const cx = coords.nx(0);
  const cy = coords.ny(0);
  for (let i = 0; i < numCircles; i++) {
    const radius = i * circleDistance;
    const circum = 2 * Math.PI * radius;
    const numDots = Math.round(circum / (dotSize * 4));
    for (let j = 0; j < numDots; j++) {
      const rotation = j * (TAU / numDots);
      const rotationProportion = rotation / TAU;
      const rotationProportionAdj = rotationProportion + Math.random() / 2; // + (Math.random() / 2) * (radius / overallRadius);
      const { x, y } = rotatePoint(cx + radius, cy, cx, cy, rotation);
      ctx.fillStyle = `hsl(${lerp(
        HSL_BAND[0],
        HSL_BAND[1],
        rotationProportionAdj % 1
      )}, 60%, 50%)`;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, TAU);
      ctx.fill();
    }
  }
};

const observer = new ResizeObserver(() => {
  const dpr = window.devicePixelRatio;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  draw(ctx);
});

observer.observe(canvas);
