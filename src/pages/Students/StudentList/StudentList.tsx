import { FunctionComponent, useState } from "react";

import { getCountry } from "models/country";
import { handleEgGov } from "models/governorate";
import { Status, statuses, Student } from "models/student";
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
import Popup, { PopupProps } from "components/Popup";

interface StudentListProps {}

const StudentList: FunctionComponent<StudentListProps> = () => {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const stu = usePageT("students");
  const pi = usePersonalInfoT();

  const { data, fetchStudents, updateStudent } = useStudents();

  const [popupProps, setPopupProps] = useState<PopupProps>({ visible: false });

  const updateStatus = (student: Student, status: Status) => {
    updateStudent(student.id, { meta: { ...student.meta, status } });
    setPopupProps({ visible: false });
  };

  const handlePopup = (student: Student) => () =>
    setPopupProps({
      children: (
        <div className="statusList">
          {statuses.map((status) => (
            <button
              key={status}
              className={`${status} colorCoded`}
              onClick={() => updateStatus(student, status)}
            >
              {glb(status)}
            </button>
          ))}
        </div>
      ),
      close: () => setPopupProps({ visible: false }),
    });

  const fields: FieldProps[] = [
    {
      name: "gender",
      header: (
        <div
          className="smallCircle"
          style={{ border: "2px solid var(--c-black)" }}
        ></div>
      ),
      className: "prefix",
      getValue: (data: Student) => (
        <div className={`smallCircle ${data.gender}`}></div>
      ),
      fit: true,
    },
    {
      name: "name",
      header: pi("fullName"),
      className: "name",
      getValue: (data: Student) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "status",
      header: pi("status"),
      className: "colorCoded",
      getValue: (data: Student) => {
        const status = data.meta.status || "unknown";
        return (
          <button
            className={`${status} colorCoded`}
            onClick={handlePopup(data)}
          >
            {glb(status)}
          </button>
        );
      },
      fit: true,
    },
    {
      name: "subscription",
      header: pi("subscription"),
      className: "colorCoded",
      getValue: (data: Student) => {
        const subscription = data.meta.subscription?.type || "unknown";
        return (
          <button
            className={`${subscription} colorCoded`}
            onClick={() => console.log("change subscription")}
          >
            {glb(subscription)}
          </button>
        );
      },
      fit: true,
    },
    {
      name: "phoneNumber",
      header: pi("phoneNumber"),
      className: "phoneNumber",
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
      name: "nationality",
      header: pi("nationality"),
      getValue: (data: Student) => getCountry(data.country)?.native,
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
    <main className="mainSection StudentList">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ fields, data, selected }}
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
      <Popup {...popupProps} />
    </main>
  );
};

export default StudentList;
