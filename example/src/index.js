import React from "react";
import { render } from "react-dom";

import LayeredImage from "react-layered-image";

const rootDivStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(238, 239, 244, 1)",
};

render(
  <div style={rootDivStyle}>
    <LayeredImage
      layers={["http://kloc.pm/images/back.png", "http://kloc.pm/images/front.png"]}
      aspectRatio={0.75}
      borderRadius={8}
      lightOpacity={0.15}
      shadowColor="#1f2933"
    />
  </div>,
  document.getElementById("root"),
);
