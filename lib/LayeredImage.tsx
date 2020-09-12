import * as React from "react"
import { createRef, useEffect, useMemo, useRef, useState } from "react"

import { applyStyles, clamp, isFunction } from "./utils"

interface Size {
  width: number
  height: number
}

enum Interaction {
  None = "NONE",
  Resize = "RESIZE",
  Hover = "HOVER",
  Active = "ACTIVE",
}

interface ILayeredImageStyles {
  root?: React.CSSProperties
  container?: React.CSSProperties
  stack?: React.CSSProperties
  layer?: React.CSSProperties | ((index: number) => React.CSSProperties)
  light?: React.CSSProperties
  shadow?: React.CSSProperties
}

export interface ILayeredImageProps extends React.HTMLProps<HTMLDivElement> {
  layers: Array<string>
  aspectRatio?: number
  borderRadius?: React.CSSProperties["borderRadius"]
  transitionDuration?: number
  transitionTimingFunction?: React.CSSProperties["transitionTimingFunction"]
  lightColor?: React.CSSProperties["color"]
  lightOpacity?: React.CSSProperties["opacity"]
  shadowColor?: React.CSSProperties["color"]
  shadowOpacity?: React.CSSProperties["opacity"]
}

export const LayeredImage: React.FC<ILayeredImageProps> = ({
  layers,
  aspectRatio = 16 / 10,
  borderRadius = 12,
  transitionDuration = 0.15,
  transitionTimingFunction = "ease-out",
  lightColor = "#fff",
  lightOpacity = 0.2,
  shadowColor = "#000",
  shadowOpacity = 0.6,
  className,
  style,
}) => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const [interaction, setInteraction] = useState<Interaction>(Interaction.None)
  const [loaded, setLoaded] = useState<number>(0)
  const [, setError] = useState<number>(0)

  const elementsRef = useRef({
    root: createRef<HTMLDivElement>(),
    container: createRef<HTMLDivElement>(),
    layers: layers.map(() => createRef<HTMLDivElement>()),
    shadow: createRef<HTMLDivElement>(),
    light: createRef<HTMLDivElement>(),
  })

  const defaultStyles = useMemo<ILayeredImageStyles>(
    () => getDefaultStyles(transitionDuration, lightColor, shadowColor),
    [transitionDuration, lightColor, shadowColor],
  )
  const styles = useMemo<ILayeredImageStyles>(
    () => ({
      root: {
        borderRadius,
        ...defaultStyles.root,
        ...staticStyles.root,
      },
      container: {
        borderRadius,
        transitionTimingFunction,
        ...defaultStyles.container,
        ...staticStyles.container,
      },
      stack: {
        borderRadius,
        ...defaultStyles.stack,
        ...staticStyles.stack,
      },
      layer: {
        transitionTimingFunction,
        ...defaultStyles.layer,
        ...staticStyles.layer,
      },
      light: {
        borderRadius,
        opacity: lightOpacity,
        ...defaultStyles.light,
        ...staticStyles.light,
      },
      shadow: {
        borderRadius,
        opacity: shadowOpacity,
        transitionTimingFunction,
        ...defaultStyles.shadow,
        ...staticStyles.shadow,
      },
    }),
    [defaultStyles, borderRadius, transitionTimingFunction, lightOpacity, shadowOpacity],
  )

  const getDimensions = () => {
    const containerRef = elementsRef.current.container
    // prettier-ignore
    const width =
      containerRef.current.offsetWidth ||
      containerRef.current.clientWidth ||
      containerRef.current.scrollWidth;
    const height = Math.round(width / aspectRatio)

    return { width, height }
  }

  const computeStyles = (
    _interaction: Interaction = interaction,
    event?: React.SyntheticEvent<HTMLDivElement>,
    pageX?: number,
    pageY?: number,
    preventDefault = false,
  ) => {
    const { width, height } = _interaction === Interaction.Resize ? getDimensions() : size

    const bodyScrollTop =
      document.body.scrollTop ||
      document.documentElement.scrollTop ||
      document.scrollingElement.scrollTop ||
      window.scrollY ||
      window.pageYOffset
    const bodyScrollLeft =
      document.body.scrollLeft ||
      document.documentElement.scrollLeft ||
      document.scrollingElement.scrollLeft ||
      window.scrollX ||
      window.pageXOffset
    const containerRect = elementsRef.current.container.current.getBoundingClientRect()

    const offsetX = (pageX - containerRect.left - bodyScrollLeft) / width
    const offsetY = (pageY - containerRect.top - bodyScrollTop) / height
    const containerCenterX = pageX - containerRect.left - bodyScrollLeft - width / 2
    const containerCenterY = pageY - containerRect.top - bodyScrollTop - height / 2

    const containerRotationX = ((offsetY - containerCenterY) / (height / 2)) * 8
    const containerRotationY = ((containerCenterX - offsetX) / (width / 2)) * 8
    const layerTranslationX = (offsetX - containerCenterX) * 0.01
    const layerTranslationY = (offsetY - containerCenterY) * 0.01
    const lightAngle = (Math.atan2(containerCenterY, containerCenterX) * 180) / Math.PI - 90

    const computedStyles: ILayeredImageStyles = {
      [Interaction.None]: defaultStyles,
      [Interaction.Resize]: {
        root: {
          height: `${height}px`,
          transform: `perspective(${width * 3}px)`,
        },
      },
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
          transitionDuration: "0.075s",
          transform: `rotateX(${containerRotationX / 1.4}deg)
                      rotateY(${containerRotationY / 1.4}deg)
                      scale(1)`,
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
          ...defaultStyles.shadow,
          transitionDuration: "0.075s",
        },
      },
    }[_interaction]

    if (preventDefault) {
      event.preventDefault()
    }

    for (const [element, styles] of Object.entries(computedStyles)) {
      if (element === "layer") {
        layers.forEach((_, index) =>
          applyStyles(elementsRef.current.layers[index].current, isFunction(styles) ? styles(index) : styles),
        )
      } else {
        applyStyles(elementsRef.current[element].current, styles)
      }
    }

    setSize({ width, height })
    setInteraction(_interaction)
  }

  // prettier-ignore
  const handleMouseInteraction =
    (_interaction?: Interaction) =>
      (event: React.MouseEvent<HTMLDivElement>) =>
        computeStyles(_interaction, event, event.pageX, event.pageY, true);

  // prettier-ignore
  const handleTouchInteraction =
    (_interaction?: Interaction) =>
      (event: React.TouchEvent<HTMLDivElement>) =>
        computeStyles(_interaction, event, event.touches[0].pageX, event.touches[0].pageY);

  const handleInteractionEnd = () => computeStyles(Interaction.None)

  useEffect(() => {
    const handleWindowResize = () => computeStyles(Interaction.Resize)

    layers.forEach((layer) => {
      const image = new Image()

      image.src = layer
      image.onload = () => setLoaded((loaded) => loaded + 1)
      image.onerror = () => setError((error) => error + 1)
    })

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  useEffect(() => {
    computeStyles(Interaction.Resize)
  }, [elementsRef.current, aspectRatio])

  return (
    <div
      onMouseEnter={handleMouseInteraction(Interaction.Hover)}
      onMouseMove={handleMouseInteraction()}
      onMouseDown={handleMouseInteraction(Interaction.Active)}
      onMouseUp={handleMouseInteraction(Interaction.Hover)}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleTouchInteraction(Interaction.Hover)}
      onTouchMove={handleTouchInteraction(Interaction.Hover)}
      onTouchEnd={handleInteractionEnd}
      className={className}
      style={{ ...styles.root, ...style }}
      ref={elementsRef.current.root}
    >
      <div style={styles.container} ref={elementsRef.current.container}>
        <div style={styles.shadow} ref={elementsRef.current.shadow} />
        <div style={styles.stack}>
          {layers.map((src, index) => (
            <div
              style={{
                ...styles.layer,
                backgroundImage: `url(${src})`,
                opacity: loaded === layers.length ? 1 : 0,
              }}
              ref={elementsRef.current.layers[index]}
              key={index}
            />
          ))}
        </div>
        <div style={styles.light} ref={elementsRef.current.light} />
      </div>
    </div>
  )
}
LayeredImage.displayName = "LayeredImage"

/*
 * Initial styles in resting state.
 */
const getDefaultStyles = (
  transitionDuration: ILayeredImageProps["transitionDuration"],
  lightColor: ILayeredImageProps["lightColor"],
  shadowColor: ILayeredImageProps["shadowColor"],
): ILayeredImageStyles => ({
  container: {
    transform: "none",
    transitionDuration: `${transitionDuration}s`,
  },
  layer: {
    transform: "none",
    transitionDuration: `${transitionDuration}s, 500ms`,
  },
  light: {
    backgroundImage: `linear-gradient(180deg, ${lightColor} 0%, transparent 80%)`,
  },
  shadow: {
    boxShadow: `0 10px 30px ${shadowColor}, 0 6px 10px ${shadowColor}`,
    transitionDuration: `${transitionDuration}s`,
  },
})

/*
 * Static styles that never change.
 */
const staticStyles: ILayeredImageStyles = {
  root: {
    position: "relative",
    width: "100%",
    transformStyle: "preserve-3d",
    cursor: "pointer",
    WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  },
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    transitionProperty: "transform",
    transformStyle: "preserve-3d",
  },
  stack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "black",
    transformStyle: "preserve-3d",
    overflow: "hidden",
  },
  layer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "transparent",
    backgroundSize: "cover",
    transitionProperty: "transform, opacity",
    opacity: 0,
  },
  light: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  shadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    transitionProperty: "transform, box-shadow",
    transform: "translateZ(-10px) scale(0.95)",
  },
}
