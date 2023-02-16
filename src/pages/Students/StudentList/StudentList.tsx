import { useEffect } from "react";

import { Button } from "components/Buttons";
import { Table } from "components/Table";
import { useStudentContext } from "context";
import { useGlobalT, useLoading, usePageT, useSelect } from "hooks";
import { prodOnly } from "utils";

import { useTableFields } from "./StudentList.utils";

export default function StudentList() {
  const glb = useGlobalT();
  const stu = usePageT("student");

  const { students, fetchStudents } = useStudentContext();

  const [selected, toggleSelect] = useSelect(() =>
    students.map(({ id }) => id)
  );

  const [loadStudents, isLoading] = useLoading((stopLoading) => {
    fetchStudents({ onCompleted: stopLoading });
  });

  useEffect(
    prodOnly(() => {
      if (!students.length) loadStudents();
    }),
    []
  );

  const fields = useTableFields();

  return (
    <div className="StudentList">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ fields, selected }}
        data={students}
        toggleSelect={toggleSelect}
        extraProps={({ data: { gender } }) => ({ gender })}
        footer={
          <Button
            className="loadMore"
            variant="gray-text"
            onClick={loadStudents}
            isLoading={isLoading}
          >
            {glb("loadMore")}
          </Button>
        }
      />
    </div>
  );
}
