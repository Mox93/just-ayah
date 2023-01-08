import { VFC, useState, useEffect, useMemo } from "react";

import { Button } from "components/Buttons";
import { FieldProps, Table } from "components/Table";
import { useTeacherContext } from "context";
import { useGlobalT, useLoading, usePageT, usePersonalInfoT } from "hooks";
import { Teacher } from "models/teacher";
import { concat, prodOnly } from "utils";
import { getPhoneNumberByTag, historyRep } from "models/blocks";

interface TeacherListProps {}

const TeacherList: VFC<TeacherListProps> = () => {
  const glb = useGlobalT();
  const tch = usePageT("teacher");
  const pi = usePersonalInfoT();

  const { teachers, fetchTeachers } = useTeacherContext();

  const fields = useMemo<FieldProps<Teacher>[]>(
    () => [
      {
        name: "name",
        header: pi("fullName"),
        className: "name",
        getValue: ({ firstName, middleName, lastName }) =>
          concat(firstName, middleName, lastName),
      },
      {
        name: "phoneNumber",
        header: pi("phoneNumber"),
        className: "phoneNumber",
        getValue: ({ phoneNumber }) =>
          getPhoneNumberByTag(phoneNumber, "whatsapp"),
        fit: true,
      },
      {
        name: "dateCreated",
        header: glb("dateCreated"),
        getValue: ({ meta: { dateCreated } }) => historyRep(dateCreated),
        fit: true,
      },
    ],
    [pi, glb]
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (id: string) =>
    setSelected((state) => {
      return id === "*"
        ? new Set([...teachers.map(({ id }) => id), "*"])
        : new Set(state.add(id));
    });

  const handleDeselect = (id: string) =>
    setSelected((state) => {
      if (id === "*") {
        return new Set();
      } else {
        state.delete(id);
        return new Set(state);
      }
    });

  const [loadTeachers, isLoading] = useLoading((stopLoading) => {
    fetchTeachers({
      options: { onFulfilled: stopLoading, onRejected: stopLoading },
    });
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
        toggleSelect={(checked, id) =>
          checked ? handleSelect(id) : handleDeselect(id)
        }
        toggleSelectAll={(checked) =>
          setSelected(
            checked ? new Set(teachers.map(({ id }) => id)) : new Set()
          )
        }
        extraProps={({ gender }) => ({ gender })}
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
