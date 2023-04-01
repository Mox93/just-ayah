import { capitalize } from "utils";

export const requestStates = ["idle", "loading", "success", "failure"] as const;

export type RequestState = typeof requestStates[number];

export type RequestStateMap = {
  [K in RequestState as `is${Capitalize<K>}`]: boolean;
};

export function requestStateMap(state: RequestState) {
  return requestStates.reduce(
    (obj, key) => ({ ...obj, [`is${capitalize(key)}`]: state === key }),
    {}
  ) as RequestStateMap;
}
