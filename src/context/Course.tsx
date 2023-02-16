import { createContext, FC, useContext } from "react";

import { useMetaContext } from ".";

interface CourseContext {
  data: { courses: string[] };
}

const initialState: CourseContext = {
  data: { courses: [] },
};

const courseContext = createContext(initialState);

export const CourseProvider: FC = ({ children }) => {
  const { shortList: { courses = [] } = {} } = useMetaContext();

  return (
    <courseContext.Provider value={{ data: { courses } }}>
      {children}
    </courseContext.Provider>
  );
};

export const useCourseContext = () => useContext(courseContext);
