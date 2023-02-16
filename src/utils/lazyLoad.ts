import { lazy } from "react";

export function lazyLoad(path: string, name?: string) {
  return lazy(() => {
    const result = import(path);

    return name
      ? result.then(({ [name]: Component }) => ({ default: Component }))
      : result;
  });
}
