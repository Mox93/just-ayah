import { lazy } from "react";

export const EnrolledMessage = lazy(() => import("./EnrolledMessage"));
export const ErrorMessage = lazy(() => import("./ErrorMessage"));
export const ErrorToast = lazy(() => import("./ErrorToast"));
export const FlashCard = lazy(() => import("./FlashCard"));
export const ReachOutMessage = lazy(() => import("./ReachOutMessage"));
export const SuccessToast = lazy(() => import("./SuccessToast"));
export const WarningMessage = lazy(() => import("./WarningMessage"));
