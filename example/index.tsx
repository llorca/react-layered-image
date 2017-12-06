import * as React from "react";
import { render } from "react-dom";

import LayeredImage from "../lib";

const style: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  padding: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#e1e8ed",
};

render(
  <div style={style}>
    <LayeredImage
      layers={[1, 2, 3].map(index => `./static/images/dazzle-layer-${index}.png`)}
      aspectRatio={0.6}
      lightOpacity={0.25}
      shadowColor="#1f2933"
      shadowOpacity={0.55}
      style={{ width: 400 }}
    />
  </div>,
  document.getElementById("root"),
);
