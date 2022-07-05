/**
 * Apply a set of styles to an HTML element.
 */
export const applyStyles = (element: HTMLDivElement, styles: React.CSSProperties) => {
  for (const [style, value] of Object.entries(styles)) {
    element.style[style] = value
  }
}

/**
 * Clamp the `value` between `min` and `max` inclusively.
 */
export const clamp = (value: number, min: number, max: number) => {
  const maximum = max < min ? min : max

  return value != null ? Math.min(Math.max(value, min), maximum) : value
}

/**
 * Return `true` if the value is a `function`.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function => typeof value === "function"

/**
 * Detect whether the current browser is a desktop version of Safari.
 */
export const isSafariDesktop = () => {
  const { userAgent, vendor } = navigator

  return /Safari/i.test(userAgent) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(userAgent)
}
