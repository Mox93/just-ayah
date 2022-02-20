import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import { getCountry } from "models/country";
import { handleEgGov } from "models/governorate";
import { Student } from "models/student";
import { getOccupation } from "models/work";
import { getAge, historyRep } from "models/dateTime";
import Table, { FieldProps } from "components/Table";

interface StudentListProps {
  data: Student[];
}

const StudentList: FunctionComponent<StudentListProps> = ({ data }) => {
  const { t } = useTranslation();
  const s = (value: string, options?: any) => t(`students.${value}`, options);
  const pi = (value: string) => t(`personal_info.${value}`);
  const g = (value: string) => t(`governorate.egypt.${value}`);

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
      header: pi("full_name"),
      getValue: (data: Student) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "phone-number",
      className: "phone-number",
      header: pi("phone_number"),
      getValue: (data: Student) => data.phoneNumber.number,
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
      name: "location",
      header: pi("location"),
      getValue: (data: Student) => {
        const parts = [getCountry(data.country)?.native];
        if (data.governorate) parts.push(handleEgGov(data.governorate, g));
        return parts.join(" - ");
      },
    },
    {
      name: "course",
      header: t("elements.course"),
    },
    {
      name: "date-created",
      header: t("elements.date_created"),
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
    <>
      {selected.size > 0 && (
        <div className="selectionCounter">
          {s("counter", { count: selected.size })}
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
