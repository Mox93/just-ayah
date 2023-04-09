import { lazy } from "react";

export { default as SelectionMenu } from "./SelectionMenu";
export { default as StatusMenu } from "./StatusMenu";

export const TeacherMenu = lazy(() => import("./TeacherMenu"));
export const CourseMenu = lazy(() => import("./CourseMenu"));
