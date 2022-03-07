import { FunctionComponent, useState } from "react";
import { Teacher } from "models/teacher";
import { historyRep } from "models/dateTime";
import Table, { FieldProps } from "../../../components/Table";
import { useGlobalT, usePageT, usePersonalInfoT } from "utils/translation";

interface StudentListProps {
  data: Teacher[];
}

const StudentList: FunctionComponent<StudentListProps> = ({ data }) => {
  const glb = useGlobalT();
  const stu = usePageT("students");
  const pi = usePersonalInfoT();

  const fields: FieldProps[] = [
    {
      name: "name",
      header: pi("fullName"),
      getValue: (data: Teacher) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "phone-number",
      header: pi("phoneNumber"),
      getValue: (data: Teacher) => data.phoneNumber.number,
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
      name: "date-created",
      header: glb("dateCreated"),
      getValue: (data: Teacher) => historyRep(data.meta.dateCreated),
      fit: true,
    },
  ];

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (id: string) =>
    setSelected((state) => {
      return id === "*"
        ? new Set([...data.map(({ id }) => id), "*"])
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

  return (
    <>
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ fields, data }}
        selected={selected}
        toggleSelect={(checked, id) =>
          checked ? handleSelect(id) : handleDeselect(id)
        }
        toggleSelectAll={(checked) =>
          setSelected(checked ? new Set(data.map(({ id }) => id)) : new Set())
        }
      />
    </>
  );
};

export default StudentList;
