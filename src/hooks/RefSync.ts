import { useRef } from "react";

export default function useRefSync<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}
