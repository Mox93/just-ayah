import { uniqueId } from "lodash";
import useRefSync from "./RefSync";

export default function useUniqueId(prefix?: string) {
  return useRefSync(uniqueId(prefix && `${prefix}-`)).current;
}
