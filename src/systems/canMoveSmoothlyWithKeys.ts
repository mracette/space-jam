import { Velocity } from "../components/Velocity";

export const canMoveSmoothlyWithKeys = (
  self: { velocity: Velocity } & unknown,
  velocityConstant: number
): void => {
  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case "w":
        self.velocity.y = velocityConstant;
        break;
      case "ArrowLeft":
      case "a":
        self.velocity.x = -velocityConstant;
        break;
      case "ArrowDown":
      case "s":
        self.velocity.y = -velocityConstant;
        break;
      case "ArrowRight":
      case "d":
        self.velocity.x = velocityConstant;
        break;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case "w":
        self.velocity.y = 0;
        break;
      case "ArrowLeft":
      case "a":
        self.velocity.x = 0;
        break;
      case "ArrowDown":
      case "s":
        self.velocity.y = 0;
        break;
      case "ArrowRight":
      case "d":
        self.velocity.x = 0;
        break;
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
};
