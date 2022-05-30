import { createContext, FC, useContext } from "react";

import { useMetaContext } from ".";

interface CourseContext {
  data: { courses: string[] };
}

const initialState: CourseContext = {
  data: { courses: [] },
};

const courseContext = createContext(initialState);

interface CourseProviderProps {}

export const CourseProvider: FC<CourseProviderProps> = ({ children }) => {
  const {
    data: { shortList: { courses = [] } = {} },
  } = useMetaContext();

  return (
    <courseContext.Provider value={{ data: { courses } }}>
      {children}
    </courseContext.Provider>
  );
};

export const useCourseContext = () => useContext(courseContext);
