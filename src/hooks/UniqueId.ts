import { uniqueId } from "lodash";
import { useRef } from "react";

export default function useUniqueId(prefix?: string) {
  return useRef(uniqueId(prefix && `${prefix}-`)).current;
}
