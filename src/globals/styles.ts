import { COLORS } from "./colors";
import { DEBUG } from "./game";

export const FONT_STYLE = '"Verdana", sans-serif';

export const STYLES = {
  menuButton: {
    marginBottom: "5vh",
    cursor: "pointer",
    border: "1px solid white",
    position: "absolute",
    width: "10vh",
    height: "10vh",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    fontSize: "24px",
    alignSelf: "flex-end",
    transitionDuration: "250ms"
  },
  menu: {
    visibility: DEBUG ? "" : "hidden",
    background: "rgba(0,0,0,.75)",
    justifyContent: "flex-start"
  },
  menuCol: {
    justifyContent: "flex-start"
  },
  canvasPre: {
    background: COLORS.BACKGROUND
  },
  co: {
    width: "unset"
  },
  to: {
    width: "unset"
  },
  so: {
    width: "unset"
  }
};
