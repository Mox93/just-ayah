import { createContext, FC, useContext } from "react";

import { Teacher, teacherFromDB } from "models/teacher";

import { useEnroll } from "./hooks";
import { EnrollContext, initialState } from "./models";

export const teacherEnrollContext = createContext(initialState);

export const useTeacherEnrollContext = () =>
  useContext<EnrollContext<Teacher>>(teacherEnrollContext);

export const TeacherEnrollProvider: FC = ({ children }) => {
  const value = useEnroll({
    collectionName: "teachers",
    converterFromDB: teacherFromDB,
  });

  return (
    <teacherEnrollContext.Provider value={value}>
      {children}
    </teacherEnrollContext.Provider>
  );
};
