import { style } from "typestyle";

export default {
  root: style({
    position: "relative",
    width: "100%",
    transformStyle: "preserve-3d",
    cursor: "pointer",
    "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
  }),
  container: style({
    position: "absolute",
    width: "100%",
    height: "100%",
    transitionProperty: "transform",
    transformStyle: "preserve-3d",
  }),
  layers: style({
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "black",
    transformStyle: "preserve-3d",
    overflow: "hidden",
  }),
  layer: style({
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "transparent",
    backgroundSize: "cover",
    transitionProperty: "transform, opacity",
    opacity: 0,
  }),
  light: style({
    position: "absolute",
    width: "100%",
    height: "100%",
  }),
  shadow: style({
    position: "absolute",
    width: "100%",
    height: "100%",
    transitionProperty: "transform, box-shadow",
    transform: "translateZ(-10px) scale(0.95)",
  }),
};
