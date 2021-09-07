import { CanvasCoordinates } from "../src/core/Coords";
import { COLORS } from "../src/globals/colors";
import { lerp, rotatePoint } from "../src/utils/math";

const TAU = Math.PI * 2;

const canvas = document.createElement("canvas");
canvas.style.background = COLORS.BACKGROUND;
canvas.className = "fill-absolute";

document.body.appendChild(canvas);

const drawStar = (ctx: CanvasRenderingContext2D, cx, cy, size): void => {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size / 2);
  ctx.quadraticCurveTo(cx, cy, cx + size / 2, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + size / 2);
  ctx.quadraticCurveTo(cx, cy, cx - size / 2, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - size / 2);
};

const draw = (canvas: HTMLCanvasElement, hueStart = 0, hueEnd = 360): void => {
  const COORDS = new CanvasCoordinates(canvas);
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "white";
  ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
  ctx.lineWidth = COORDS.width(0.01);
  drawStar(ctx, COORDS.nx(0), COORDS.ny(0), COORDS.width(0.05));
  ctx.fill();
  ctx.stroke();
};

// const draw = (canvas: HTMLCanvasElement, hueStart = 0, hueEnd = 360): void => {
//   const ctx = canvas.getContext("2d");
//   const numRings = 10;
//   const designRadius = Math.sqrt((Math.max(canvas.width, canvas.height) / 2) ** 2 * 2);
//   const ringDistance = designRadius / numRings;
//   const dotSize = ringDistance / 5;
//   const cx = canvas.width / 2;
//   const cy = canvas.height / 2;
//   for (let i = 0; i < ringDistance; i++) {
//     const ringRadius = i * ringDistance;
//     const circumference = 2 * Math.PI * ringRadius;
//     const numDots = Math.round(circumference / (dotSize * 4));

//     for (let j = 0; j < numDots; j++) {
//       const rotation = j * (TAU / numDots);
//       const rotationProportion = rotation / TAU;
//       const rotationProportionAdj = rotationProportion + Math.random() / 2;
//       const { x, y } = rotatePoint(cx + ringRadius, cy, cx, cy, rotation);
//       ctx.fillStyle = `hsl(${lerp(
//         hueStart,
//         hueEnd,
//         rotationProportionAdj % 1
//       )}, 60%, 50%)`;
//       ctx.beginPath();
//       ctx.arc(x, y, dotSize, 0, TAU);
//       ctx.fill();
//     }
//   }
// };

const observer = new ResizeObserver(() => {
  const dpr = window.devicePixelRatio;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  draw(canvas);
});

observer.observe(canvas);
