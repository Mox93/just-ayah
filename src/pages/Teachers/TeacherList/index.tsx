import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Teacher } from "models/teacher";
import { historyRep } from "utils/dateTime";
import Table, { FieldProps } from "../../../components/Table";

interface StudentListProps {
  data: Teacher[];
}

const StudentList: FunctionComponent<StudentListProps> = ({ data }) => {
  const { t } = useTranslation();
  const s = (value: string, options?: any) => t(`students.${value}`, options);
  const pi = (value: string) => t(`personal_info.${value}`);

  const fields: FieldProps[] = [
    {
      name: "name",
      header: pi("full_name"),
      getValue: (data: Teacher) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "phone-number",
      header: pi("phone_number"),
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
      header: t("elements.date_created"),
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
