import {
  menu,
  processProps,
  registerField,
} from "components/Form/utils/formModifiers";

export * from "./metaData";
export * from "./session";

export function menuModifiers<T extends {}>() {
  return [processProps<T>(), menu<T>(), registerField<T>()] as const;
}
