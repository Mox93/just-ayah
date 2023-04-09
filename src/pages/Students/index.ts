import { lazy } from "react";

export const Students = lazy(() => import("./Students"));
export const StudentEnroll = lazy(() => import("./StudentEnroll"));
export const StudentList = lazy(() => import("./StudentList"));
export const StudentProfile = lazy(() => import("./StudentProfile"));
