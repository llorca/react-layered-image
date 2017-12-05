/// <reference types="react" />
import * as React from "react";

export enum Interaction {
  None = "NONE",
  Hover = "HOVER",
  Active = "ACTIVE",
  Resize = "RESIZE",
}

export interface ILayeredImageProps extends React.HTMLProps<HTMLDivElement> {
  layers: Array<string>;
  aspectRatio: number;
  borderRadius?: React.CSSProperties["borderRadius"];
  transitionDuration?: React.CSSProperties["transitionDuration"];
  transitionTimingFunction?: React.CSSProperties["transitionTimingFunction"];
  lightColor?: React.CSSProperties["color"];
  lightOpacity?: React.CSSProperties["opacity"];
  shadowColor?: React.CSSProperties["color"];
  shadowOpacity?: React.CSSProperties["opacity"];
}

export interface ILayeredImageState {
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  interaction: Interaction;
  loaded: number;
  error: number;
}

export default class LayeredImage extends React.Component<ILayeredImageProps, ILayeredImageState> {
  static defaultProps: Partial<ILayeredImageProps>;
  state: ILayeredImageState;
  private elements;
  private refHandlers;
  private images;
  render(): JSX.Element;
  componentDidMount(): void;
  componentWillReceiveProps(nextProps: ILayeredImageProps): void;
  componentWillUnmount(): void;
  private handleMouseInteraction;
  private handleTouchInteraction;
  private handleInteractionEnd;
  private handleWindowResize;
  private getDimensions;
  private computeStyles;
  private applyStyles;
}
