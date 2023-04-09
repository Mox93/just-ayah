import { get, memoize } from "lodash";

import { Path } from "models";

export const sortBy = memoize(
  <T extends {}>(path: Path<T>) =>
    (list: T[]) =>
      list.sort((a, b) => (get(a, path) > get(b, path) ? 1 : -1))
);
