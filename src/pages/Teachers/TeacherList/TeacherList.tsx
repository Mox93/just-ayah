import { VFC, useState, useEffect } from "react";

import { Button } from "components/Buttons";
import { FieldProps, Table } from "components/Table";
import { useTeacherContext } from "context";
import { useGlobalT, useLoading, usePageT, usePersonalInfoT } from "hooks";
import { Teacher } from "models/teacher";
import { historyRep } from "models/dateTime";
import { getPhoneNumberByTag } from "models/phoneNumber";

interface StudentListProps {}

const StudentList: VFC<StudentListProps> = () => {
  const glb = useGlobalT();
  const stu = usePageT("student");
  const pi = usePersonalInfoT();

  const { teachers, fetchTeachers } = useTeacherContext();

  const fields: FieldProps[] = [
    {
      name: "name",
      header: pi("fullName"),
      getValue: (data: Teacher) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "phoneNumber",
      header: pi("phoneNumber"),
      getValue: ({ phoneNumber }) =>
        getPhoneNumberByTag(phoneNumber, "whatsapp"),
      fit: true,
    },
    {
      name: "gender",
      header: pi("gender"),
      getValue: (data: Teacher) => (
        <div className={`color-coded ${data.gender}`}></div>
      ),
      fit: true,
    },
    {
      name: "dateCreated",
      header: glb("dateCreated"),
      getValue: (data: Teacher) => historyRep(data.meta.dateCreated),
      fit: true,
    },
  ];

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
    if (process.env.REACT_APP_ENV === "production") loadTeachers();
  }, []);

  return (
    <div className="TeacherList">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
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

export default StudentList;
