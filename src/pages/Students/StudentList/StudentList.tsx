import { Button } from "components/Buttons";
import { Table } from "components/Table";
import { useStudentContext } from "context";
import {
  useApplyOnce,
  useGlobalT,
  useLoading,
  usePageT,
  useSelect,
} from "hooks";
import { IS_PROD } from "models/config";

import { useTableFields } from "./StudentList.utils";

export default function StudentList() {
  const glb = useGlobalT();
  const stu = usePageT("student");

  const { students, fetchStudents } = useStudentContext();

  const [selected, setSelect] = useSelect(() => students.map(({ id }) => id));

  const [loadStudents, isLoading] = useLoading((stopLoading) =>
    fetchStudents({ onCompleted: stopLoading })
  );

  useApplyOnce(loadStudents, IS_PROD && !students.length);

  return (
    <>
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ selected, setSelect }}
        className="StudentList"
        fields={useTableFields()}
        data={students}
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
    </>
  );
}
