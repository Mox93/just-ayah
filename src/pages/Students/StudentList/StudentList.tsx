import { FunctionComponent, useState } from "react";

import { getCountry } from "models/country";
import { handleEgGov } from "models/governorate";
import { Student } from "models/student";
import { getOccupation } from "models/work";
import { getAge, historyRep } from "models/dateTime";
import Table, { FieldProps } from "components/Table";
import { useStudents } from "context/Students";
import {
  useGlobalT,
  useGovT,
  usePageT,
  usePersonalInfoT,
} from "utils/translation";

interface StudentListProps {}

const StudentList: FunctionComponent<StudentListProps> = () => {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const stu = usePageT("students");
  const pi = usePersonalInfoT();

  const { data, fetchStudents } = useStudents();

  const fields: FieldProps[] = [
    {
      name: "gender",
      className: "prefix",
      header: (
        <div
          className="small-circle"
          style={{ border: "2px solid var(--c-black)" }}
        ></div>
      ),
      getValue: (data: Student) => (
        <div className={`small-circle ${data.gender}`}></div>
      ),
      fit: true,
    },
    {
      name: "name",
      className: "name",
      header: pi("fullName"),
      getValue: (data: Student) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "phone-number",
      className: "phone-number",
      header: pi("phoneNumber"),
      getValue: (data: Student) => data.phoneNumbers[0]?.number,
      fit: true,
    },
    {
      name: "age",
      header: pi("age"),
      getValue: (data: Student) => getAge(data.dateOfBirth),
      fit: true,
    },
    {
      name: "education",
      header: pi("education"),
    },
    {
      name: "occupation",
      header: pi("occupation"),
      getValue: (data: Student) =>
        data.workStatus && getOccupation(data.workStatus, pi),
    },
    {
      name: "residence",
      header: pi("residence"),
      getValue: (data: Student) => {
        const parts = [getCountry(data.country)?.native];
        if (data.governorate) parts.push(handleEgGov(data.governorate, gov));
        return parts.join(" - ");
      },
    },
    {
      name: "course",
      header: glb("course"),
    },
    {
      name: "date-created",
      header: glb("dateCreated"),
      getValue: (data: Student) => historyRep(data.meta.dateCreated),
      fit: true,
    },
  ];

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (id: string) =>
    setSelected((state) => new Set(state.add(id)));
  const handleDeselect = (id: string) =>
    setSelected((state) => {
      state.delete(id);
      return new Set(state);
    });

  return (
    <main className="main-section">
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
      <button className="cta-btn" onClick={() => fetchStudents()}>
        {`${glb("loadMore")} ...`}
      </button>
    </main>
  );
};

export default StudentList;
