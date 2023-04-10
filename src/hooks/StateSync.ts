import { useEffect, useState } from "react";

export default function useStateSync<T>(externalState: T | (() => T)) {
  const [state, setState] = useState(externalState);

  useEffect(() => setState(externalState), [externalState]);

  return [state, setState] as const;
}
