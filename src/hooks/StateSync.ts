import { useEffect, useState } from "react";

import { ValueOrGetter } from "utils";

export default function useStateSync<T>(externalState: ValueOrGetter<T>) {
  const [state, setState] = useState(externalState);

  useEffect(() => setState(externalState), [externalState]);

  return [state, setState] as const;
}
