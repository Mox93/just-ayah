import { ReactNode } from "react";

export const UNKNOWN = "unknown";

export interface ProviderProps {
  children?: ReactNode;
}

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];

export type Keys<T> = { [K in keyof T]-?: K }[keyof T];
