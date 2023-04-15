import { useEffect, useRef } from "react";

export default function useRefSync<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
