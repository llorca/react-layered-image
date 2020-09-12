# react-layered-image

[react-layered-image](https://llorca.github.io/react-layered-image/) is an interactive, multi-layer image component for
[React](https://reactjs.org/), inspired by the
[Apple TV layered images](https://developer.apple.com/tvos/human-interface-guidelines/icons-and-images/layered-images/).

#### Features

* Runs at 60fps on Chrome 54+, Firefox 49+, Safari 6.1+
* Preserves aspect ratio through resizing
* Loads images asynchronously

## Installation

```
npm install react-layered-image
```

## Basic example

```js
import * as React from "react";
import { render } from "react-dom";

import { LayeredImage } from "react-layered-image";

const style = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const layers = [
  "https://llorca.github.io/react-layered-image/static/images/layer-1.png",
  "https://llorca.github.io/react-layered-image/static/images/layer-2.png",
  "https://llorca.github.io/react-layered-image/static/images/layer-3.png",
];

render(
  <div style={style}>
    <LayeredImage layers={layers} style={{ width: 400 }} />
  </div>,
  document.getElementById("root"),
);
```

## API

By default, `LayeredImage` has a width of `100%`. You can set the CSS
[`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) property via a class name or via the `style` prop
directly. You can use any length or percentage value.

| Prop                       | Type            | Default      | Description                                                                       |
| -------------------------- | --------------- | ------------ | --------------------------------------------------------------------------------- |
| `layers`                   | `Array<string>` |              | **Required**. Array of image URLs. Use images of same dimension for best results. |
| `aspectRatio`              | `number`        | `16 / 9`     | Aspect ratio (`width / height`) of the element.                                   |
| `borderRadius`             | `number`        | `6`          | Radius of the element.                                                            |
| `transitionDuration`       | `number`        | `0.15`        | Duration of the transition.                                                       |
| `transitionTimingFunction` | `string`        | `"ease-out"` | Timing function of the transition.                                                |
| `lightColor`               | `string`        | `"#fff"`     | Color of the light element.                                                       |
| `lightOpacity`             | `number`        | `0.2`        | Opacity of the light element.                                                     |
| `shadowColor`              | `string`        | `"#000"`     | Color of the shadow element.                                                      |
| `shadowOpacity`            | `number`        | `0.6`        | Opacity of the shadow element.                                                    |

## Development

Start the [webpack](https://github.com/webpack/webpack) development server:

```
npm run dev
```

Use [Commitizen](https://github.com/commitizen/cz-cli) to commit changes:

```
npm run commit
```

## License

[MIT](./LICENSE)
