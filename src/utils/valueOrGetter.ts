export type ValueOrGetter<T> = T | (() => T);

export function resolveValue<T>(valueOrGetter: ValueOrGetter<T>): T {
  return typeof valueOrGetter === "function"
    ? (valueOrGetter as () => T)()
    : valueOrGetter;
}

function resolveIfValue<T>(valueOrGetter: ValueOrGetter<T>, fallback: T): T;
function resolveIfValue<T>(valueOrGetter: ValueOrGetter<T>): T | undefined;
function resolveIfValue<T>(
  valueOrGetter: ValueOrGetter<T>,
  fallback?: T
): T | undefined {
  return typeof valueOrGetter === "function" ? fallback : (valueOrGetter as T);
}

export { resolveIfValue };
