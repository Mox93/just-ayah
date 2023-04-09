import { isValidElement } from "react";
import { isForwardRef } from "react-is";

export function isDOMElement(element: any): boolean {
  return isValidElement(element) && typeof element.type === "string";
}

export function isRefElement(element: any): boolean {
  return isForwardRef(element) || isDOMElement(element);
}
