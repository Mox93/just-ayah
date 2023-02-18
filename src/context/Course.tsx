import { createContext, PropsWithChildren, useContext } from "react";

import { useMetaContext } from ".";

interface CourseContext {
  data: { courses: string[] };
}

const initialState: CourseContext = {
  data: { courses: [] },
};

const courseContext = createContext(initialState);

export function CourseProvider({ children }: PropsWithChildren) {
  const { shortList: { courses = [] } = {} } = useMetaContext();

  return (
    <courseContext.Provider value={{ data: { courses } }}>
      {children}
    </courseContext.Provider>
  );
}

export const useCourseContext = () => useContext(courseContext);
