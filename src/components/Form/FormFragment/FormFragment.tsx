import { ReactNode } from "react";

import { passPropsToFormChildren } from "../utils/formModifiers";

export interface InputFormFragment {
  children: ReactNode;
}

export default function FormFragment({
  children,
  ...props
}: InputFormFragment) {
  return <>{passPropsToFormChildren(children, props)}</>;
}
