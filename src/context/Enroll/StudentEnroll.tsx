import { createContext, FC, useContext } from "react";

import { Student, studentFromDB } from "models/student";

import { useEnroll } from "./hooks";
import { EnrollContext, initialState } from "./models";

export const studentEnrollContext = createContext(initialState);

export const useStudentEnrollContext = () =>
  useContext<EnrollContext<Student>>(studentEnrollContext);

export const StudentEnrollProvider: FC = ({ children }) => {
  const value = useEnroll({
    collectionName: "students",
    converterFromDB: studentFromDB,
  });

  return (
    <studentEnrollContext.Provider value={value}>
      {children}
    </studentEnrollContext.Provider>
  );
};
