import { lazy } from "react";

export const Courses = lazy(() => import("./Courses"));
export const CourseList = lazy(() => import("./CourseList"));
export const CourseProfile = lazy(() => import("./CourseProfile"));
export const NewCourse = lazy(() => import("./NewCourse"));
