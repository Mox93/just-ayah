import { lazy } from "react";

export * from "./Session";

export const MetaData = lazy(() => import("./MetaData"));
export const Temp = lazy(() => import("./Temp"));
