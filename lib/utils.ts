export function clamp(value: number, min: number, max: number) {
  if (max < min) {
    throw new Error("clamp: max cannot be less than min");
  }

  return value != null ? Math.min(Math.max(value, min), max) : value;
}

export function isFunction(value: any): value is Function {
  return typeof value === "function";
}
