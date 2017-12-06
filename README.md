# react-layered-image

[react-layered-image](https://llorca.github.io/react-layered-image/) is an interactive, multi-layer image component for
[React](https://reactjs.org/), inspired by the
[Apple TV layered images](https://developer.apple.com/tvos/human-interface-guidelines/icons-and-images/layered-images/).

#### Features

* Runs at 60fps on Chrome 54+, Firefox 49+, Safari 6.1+, Mobile Safari 6.1+
* Defines size with CSS `width`, i.e. `style={{ width: ... }}`
* Preserves aspect ratio through resizing
* Loads images asynchronously

## Installation

```
npm install react-layered-image
```

## Example

```js
import * as React from "react";
import { render } from "react-dom";

import LayeredImage from "react-layered-image";

const style = {
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
    <LayeredImage layers={["array", "of", "image paths"]} style={{ width: 400 }} />
  </div>,
  document.getElementById("root"),
);
```

## API

| Prop                                      | Type            | Description                                                                           |
| ----------------------------------------- | --------------- | ------------------------------------------------------------------------------------- |
| `layers`                                  | `Array<string>` | **Required**. Array of image URLs. It is recommended to use images of same dimension. |
| `aspectRatio` _= 16 / 10_                 | `number`        | Aspect ratio (`width / height`) of the layered image.                                 |
| `borderRadius` _= 6_                      | `number`        | Radius of the layered image.                                                          |
| `transitionDuration` _= 0.2_              | `number`        | Duration of the transition.                                                           |
| `transitionTimingFunction` _= "ease-out"_ | `string`        | Timing function of the transition.                                                    |
| `lightColor` _= "#fff"_                   | `string`        | Color of the light element.                                                           |
| `lightOpacity` _= 0.1_                    | `number`        | Opacity of the light element.                                                         |
| `shadowColor` _= "#000"_                  | `string`        | Color of the shadow element.                                                          |
| `shadowOpacity` _= 0.6_                   | `number`        | Opacity of the shadow element.                                                        |

## License

[MIT](./LICENSE)
