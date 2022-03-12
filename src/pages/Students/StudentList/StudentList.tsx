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
import { getPhoneNumberByTag } from "models/phoneNumber";

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
          className="smallCircle"
          style={{ border: "2px solid var(--c-black)" }}
        ></div>
      ),
      getValue: (data: Student) => (
        <div className={`smallCircle ${data.gender}`}></div>
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
      name: "phoneNumber",
      className: "phoneNumber",
      header: pi("phoneNumber"),
      getValue: (data: Student) =>
        getPhoneNumberByTag(data.phoneNumbers, "whatsapp"),
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
      name: "dateCreated",
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
    <main className="mainSection">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ fields, data, selected }}
        className="StudentList"
        toggleSelect={(checked, id) =>
          checked ? handleSelect(id) : handleDeselect(id)
        }
        toggleSelectAll={(checked) =>
          setSelected(checked ? new Set(data.map(({ id }) => id)) : new Set())
        }
      />
      <button className="ctaBtn" onClick={() => fetchStudents()}>
        {`${glb("loadMore")} ...`}
      </button>
    </main>
  );
};

export default StudentList;
