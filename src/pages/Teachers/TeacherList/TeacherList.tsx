import { VFC, useEffect } from "react";

import { Button } from "components/Buttons";
import { Table } from "components/Table";
import { useTeacherContext } from "context";
import { useGlobalT, useLoading, usePageT, useSelect } from "hooks";
import { prodOnly } from "utils";

import { UseTableFields } from "./TeacherList.utils";

interface TeacherListProps {}

const TeacherList: VFC<TeacherListProps> = () => {
  const glb = useGlobalT();
  const tch = usePageT("teacher");

  const { teachers, fetchTeachers } = useTeacherContext();

  const fields = UseTableFields();

  const [selected, toggleSelect] = useSelect(() =>
    teachers.map(({ id }) => id)
  );

  const [loadTeachers, isLoading] = useLoading((stopLoading) => {
    fetchTeachers({ onCompleted: stopLoading });
  });

  useEffect(() => {
    prodOnly(() => {
      if (!teachers.length) loadTeachers();
    })();
  }, []);

  return (
    <div className="TeacherList">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {tch("counter", { count: selected.size })}
        </div>
      )}
      <Table
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
    </div>
  );
};

export default TeacherList;
