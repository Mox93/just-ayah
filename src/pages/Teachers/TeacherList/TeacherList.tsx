import { Button } from "components/Buttons";
import { Table } from "components/Table";
import { useTeacherContext } from "context";
import {
  useApplyOnce,
  useGlobalT,
  useLoading,
  usePageT,
  useSelect,
} from "hooks";
import { IS_PROD } from "models/config";

import { UseTableFields } from "./TeacherList.utils";

export default function TeacherList() {
  const glb = useGlobalT();
  const tch = usePageT("teacher");

  const { teachers, fetchTeachers } = useTeacherContext();

  const [selected, toggleSelect] = useSelect(() =>
    teachers.map(({ id }) => id)
  );

  const [loadTeachers, isLoading] = useLoading((stopLoading) => {
    fetchTeachers({ onCompleted: stopLoading });
  });

  useApplyOnce(loadTeachers, IS_PROD && !teachers.length);

  const fields = UseTableFields();

  return (
    <>
      {selected.size > 0 && (
        <div className="selectionCounter">
          {tch("counter", { count: selected.size })}
        </div>
      )}
      <Table
        className="TeacherList"
        fields={fields}
        data={teachers}
        selected={selected}
        toggleSelect={toggleSelect}
        extraProps={({ data: { gender } }) => ({ gender })}
        footer={
          <Button
            className="loadMore"
            variant="gray-text"
            onClick={loadTeachers}
            isLoading={isLoading}
          >
            {glb("loadMore")}
          </Button>
        }
      />
    </>
  );
}
