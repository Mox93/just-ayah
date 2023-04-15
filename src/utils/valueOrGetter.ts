export type ValueOrGetter<T> = T | (() => T);

export function resolveValue<T>(valueOrGetter: ValueOrGetter<T>): T {
  return typeof valueOrGetter === "function"
    ? (valueOrGetter as () => T)()
    : valueOrGetter;
}

export function resolveIfValue<T>(
  valueOrGetter: ValueOrGetter<T>,
  fallback: T
): T;
export function resolveIfValue<T>(
  valueOrGetter: ValueOrGetter<T>
): T | undefined;
export function resolveIfValue<T>(
  valueOrGetter: ValueOrGetter<T>,
  fallback?: T
): T | undefined {
  return typeof valueOrGetter === "function" ? fallback : (valueOrGetter as T);
}
