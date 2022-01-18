import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Student } from "../models/student";
import { getOccupation } from "../models/work";
import { getAge, historyRep } from "../utils/dateTime";
import Table, { FieldProps } from "./Table";

interface StudentListProps {
  data: Student[];
}

const StudentList: FunctionComponent<StudentListProps> = ({ data }) => {
  const { t } = useTranslation();
  const s = (value: string, options?: any) => t(`students.${value}`, options);
  const pi = (value: string) => t(`personal_info.${value}`);

  const fields: FieldProps[] = [
    {
      name: "name",
      value: pi("full_name"),
      selector: (data: Student) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "phone-number",
      value: pi("phone_number"),
      selector: (data: Student) => data.phoneNumber.number,
      fit: true,
    },
    {
      name: "gender",
      value: pi("gender"),
      selector: (data: Student) => (
        <div className={`color-coded ${data.gender}`}></div>
      ),
      fit: true,
    },
    {
      name: "age",
      value: pi("age"),
      selector: (data: Student) => getAge(data.dateOfBirth),
      fit: true,
    },
    {
      name: "education",
      value: pi("education"),
    },
    {
      name: "occupation",
      value: pi("occupation"),
      selector: (data: Student) =>
        data.workStatus && getOccupation(data.workStatus),
    },
    {
      name: "location",
      value: pi("location"),
      selector: (data: Student) =>
        (data.governorate
          ? [data.country, data.governorate]
          : [data.country]
        ).join(" - "),
    },
    {
      name: "course",
      value: t("elements.course"),
    },
    {
      name: "date-created",
      value: t("elements.date_created"),
      selector: (data: Student) => historyRep(data.meta.dateCreated),
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
