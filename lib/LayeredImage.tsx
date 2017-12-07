import * as React from "react";
import { classes as classNames } from "typestyle";

import { default as classes } from "./classes";
import { clamp, isFunction } from "./utils";

export enum Interaction {
  None = "NONE",
  Resize = "RESIZE",
  Hover = "HOVER",
  Active = "ACTIVE",
}

export interface ILayeredImageProps extends React.HTMLProps<HTMLDivElement> {
  layers: Array<string>;
  aspectRatio?: number;
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

interface ILayeredImageStyles {
  root?: React.CSSProperties;
  container?: React.CSSProperties;
  layers?: React.CSSProperties;
  layer?: React.CSSProperties | ((index: number) => React.CSSProperties);
  light?: React.CSSProperties;
  shadow?: React.CSSProperties;
}

export default class LayeredImage extends React.Component<ILayeredImageProps, ILayeredImageState> {
  public static defaultProps: Partial<ILayeredImageProps> = {
    aspectRatio: 16 / 10,
    borderRadius: 6,
    transitionDuration: 0.2,
    transitionTimingFunction: "ease-out",
    lightColor: "#fff",
    lightOpacity: 0.2,
    shadowColor: "#000",
    shadowOpacity: 0.6,
  };

  public state: ILayeredImageState = {
    interaction: Interaction.None,
    loaded: 0,
    error: 0,
  };

  private elements = {
    root: null,
    container: null,
    layer: [],
    light: null,
    shadow: null,
  };

  private refHandlers = {
    root: (element: HTMLDivElement) => (this.elements.root = element),
    container: (element: HTMLDivElement) => (this.elements.container = element),
    layer: (index: number) => (element: HTMLDivElement) => (this.elements.layer[index] = element),
    light: (element: HTMLDivElement) => (this.elements.light = element),
    shadow: (element: HTMLDivElement) => (this.elements.shadow = element),
  };

  private images: Array<HTMLImageElement> = [];

  public render() {
    const {
      layers,
      borderRadius,
      transitionDuration,
      transitionTimingFunction,
      lightColor,
      lightOpacity,
      shadowColor,
      shadowOpacity,
      className,
      style,
    } = this.props;
    const { width, loaded } = this.state;
    const staticStyles = this.getStaticStyles();
    const styles: ILayeredImageStyles = {
      root: {
        borderRadius,
        transform: `perspective(${width * 3}px)`,
        ...staticStyles.root,
      },
      container: {
        borderRadius,
        transitionTimingFunction,
        ...staticStyles.container,
      },
      layers: {
        borderRadius,
        ...staticStyles.layers,
      },
      layer: {
        transitionDuration: `${transitionDuration}s, ${transitionDuration * 3}s`,
        transitionTimingFunction,
        ...staticStyles.layer,
      },
      light: {
        borderRadius,
        opacity: lightOpacity,
        ...staticStyles.light,
      },
      shadow: {
        borderRadius,
        opacity: shadowOpacity,
        transitionTimingFunction,
        ...staticStyles.shadow,
      },
    };

    return (
      <div
        onMouseEnter={this.handleMouseInteraction(Interaction.Hover)}
        onMouseMove={this.handleMouseInteraction()}
        onMouseDown={this.handleMouseInteraction(Interaction.Active)}
        onMouseUp={this.handleMouseInteraction(Interaction.Hover)}
        onMouseLeave={this.handleInteractionEnd}
        onTouchStart={this.handleTouchInteraction(Interaction.Hover)}
        onTouchMove={this.handleTouchInteraction(Interaction.Hover)}
        onTouchEnd={this.handleInteractionEnd}
        className={classNames(classes.root, className)}
        style={{ ...styles.root, ...style }}
        ref={this.refHandlers.root}
      >
        <div className={classes.container} style={styles.container} ref={this.refHandlers.container}>
          <div className={classes.shadow} style={styles.shadow} ref={this.refHandlers.shadow} />
          <div className={classes.layers} style={styles.layers}>
            {layers.map((src, index) => (
              <div
                className={classes.layer}
                style={{
                  backgroundImage: `url(${src})`,
                  opacity: loaded === layers.length ? 1 : 0,
                  ...styles.layer,
                }}
                ref={this.refHandlers.layer(index)}
                key={index}
              />
            ))}
          </div>
          <div className={classes.light} style={styles.light} ref={this.refHandlers.light} />
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.props.layers.forEach(layer => {
      const image = new Image();

      image.src = layer;
      image.onload = (event: Event) => this.setState({ loaded: this.state.loaded + 1 });
      image.onerror = (event: ErrorEvent) => this.setState({ error: this.state.error + 1 });

      this.images = [...this.images, image];
    });

    this.computeStyles({ interaction: Interaction.Resize });

    window.addEventListener("resize", this.handleWindowResize);
  }

  public componentWillReceiveProps(nextProps: ILayeredImageProps) {
    if (this.props.aspectRatio !== nextProps.aspectRatio) {
      this.computeStyles({ interaction: Interaction.Resize, aspectRatio: nextProps.aspectRatio });
    }
  }

  public componentWillUnmount() {
    this.images.forEach(image => {
      image.onerror = null;
      image.onload = null;
      image = null;
    });

    window.removeEventListener("resize", this.handleWindowResize);
  }

  // prettier-ignore
  private handleMouseInteraction =
    (interaction?: Interaction) =>
      (event: React.MouseEvent<HTMLDivElement>) =>
        this.computeStyles({ interaction }, event, event.pageX, event.pageY, true);

  // prettier-ignore
  private handleTouchInteraction =
    (interaction?: Interaction) =>
      (event: React.TouchEvent<HTMLDivElement>) =>
        this.computeStyles({ interaction }, event, event.touches[0].pageX, event.touches[0].pageY);

  private handleInteractionEnd = () => this.computeStyles({ interaction: Interaction.None });

  private handleWindowResize = () => this.computeStyles({ interaction: Interaction.Resize });

  private getDimensions = (
    aspectRatio: ILayeredImageProps["aspectRatio"] = this.props.aspectRatio,
  ): { width: number; height: number } => {
    // prettier-ignore
    const width =
      this.elements.container.offsetWidth ||
      this.elements.container.clientWidth ||
      this.elements.container.scrollWidth;
    const height = Math.round(width / aspectRatio);

    return { width, height };
  };

  private getStaticStyles = (): ILayeredImageStyles => {
    const { transitionDuration, lightColor, shadowColor } = this.props;

    return {
      container: {
        transform: "none",
        transitionDuration: `${transitionDuration}s`,
      },
      layer: {
        transform: "none",
      },
      light: {
        backgroundImage: `linear-gradient(180deg, ${lightColor} 0%, transparent 80%)`,
      },
      shadow: {
        boxShadow: `0 10px 30px ${shadowColor}, 0 6px 10px ${shadowColor}`,
        transitionDuration: `${transitionDuration}s`,
      },
    };
  };

  private computeStyles = (
    options: {
      interaction: Interaction;
      aspectRatio?: ILayeredImageProps["aspectRatio"];
    },
    event?: React.SyntheticEvent<HTMLDivElement>,
    pageX?: number,
    pageY?: number,
    preventDefault: boolean = false,
  ) => {
    const { interaction = this.state.interaction, aspectRatio } = options;
    const { layers, transitionDuration, lightColor, shadowColor } = this.props;
    const { width, height } = interaction === Interaction.Resize ? this.getDimensions(aspectRatio) : this.state;
    const staticStyles = this.getStaticStyles();

    const bodyScrollTop =
      document.body.scrollTop ||
      document.documentElement.scrollTop ||
      document.scrollingElement.scrollTop ||
      window.scrollY ||
      window.pageYOffset;
    const bodyScrollLeft = document.body.scrollLeft;
    const containerClientRect = this.elements.container.getBoundingClientRect();

    const offsetX = (pageX - containerClientRect.left - bodyScrollLeft) / width;
    const offsetY = (pageY - containerClientRect.top - bodyScrollTop) / height;
    const containerCenterX = pageX - containerClientRect.left - bodyScrollLeft - width / 2;
    const containerCenterY = pageY - containerClientRect.top - bodyScrollTop - height / 2;

    const containerRotationX = (offsetY - containerCenterY) / (height / 2) * 8;
    const containerRotationY = (containerCenterX - offsetX) / (width / 2) * 8;
    const layerTranslationX = (offsetX - containerCenterX) * 0.01;
    const layerTranslationY = (offsetY - containerCenterY) * 0.01;
    const lightAngle = Math.atan2(containerCenterY, containerCenterX) * 180 / Math.PI - 90;

    const computedStyles: ILayeredImageStyles = {
      [Interaction.None]: { ...staticStyles },
      [Interaction.Resize]: { root: { height: `${height}px` } },
      [Interaction.Hover]: {
        container: {
          transform: `rotateX(${-clamp(containerRotationX, -8, 8)}deg)
                      rotateY(${-clamp(containerRotationY, -8, 8)}deg)
                      translateX(${-layerTranslationX * 5}px)
                      translateY(${-layerTranslationY * 5}px)
                      scale(1.1)`,
        },
        layer: (index: number) => ({
          transform: `translateX(${clamp(layerTranslationX, -2, 2) * 1.4 * index}px)
                      translateY(${clamp(layerTranslationY, -2, 2) * 1.4 * index}px)
                      scale(1.04)`,
        }),
        light: {
          backgroundImage: `linear-gradient(${lightAngle}deg, ${lightColor} 0%, transparent 80%)`,
        },
        shadow: {
          boxShadow: `0 40px 100px ${shadowColor}, 0 10px 20px ${shadowColor}`,
        },
      },
      [Interaction.Active]: {
        container: {
          transform: `rotateX(${containerRotationX / 1.4}deg)
                      rotateY(${containerRotationY / 1.4}deg)
                      scale(1)`,
          transitionDuration: "0.075s",
        },
        layer: (index: number) => ({
          transform: `translateX(${-layerTranslationX * index}px)
                      translateY(${-layerTranslationY * index}px)
                      scale(1.02)`,
        }),
        light: {
          backgroundImage: `linear-gradient(${lightAngle}deg, ${lightColor} 0%, transparent 80%)`,
        },
        shadow: {
          ...staticStyles.shadow,
          transitionDuration: "0.075s",
        },
      },
    }[interaction];

    if (preventDefault) {
      event.preventDefault();
    }

    Object.keys(computedStyles).forEach(element => {
      const styles = computedStyles[element];

      if (element === "layer") {
        this.props.layers.forEach((_, index) =>
          this.applyStyles(this.elements.layer[index], isFunction(styles) ? styles(index) : styles),
        );
      } else {
        this.applyStyles(this.elements[element], styles);
      }
    });

    this.setState({ width, height, interaction });
  };

  private applyStyles = (element: HTMLDivElement, styles: React.CSSProperties) => {
    Object.keys(styles).forEach(style => {
      requestAnimationFrame(() => {
        element.style[style] = styles[style];
      });
    });
  };
}
