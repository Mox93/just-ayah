import { useState, VFC } from "react";

import { Button } from "components/Buttons";
import StatusSelector from "components/StatusSelector";
import Table, { FieldProps } from "components/Table";
import { usePopup } from "context/Popup";
import { useStudents } from "context/Students";
import { getCountry } from "models/country";
import { getAge, historyRep } from "models/dateTime";
import { handleEgGov } from "models/governorate";
import { getPhoneNumberByTag } from "models/phoneNumber";
import { Progress, Subscription } from "models/status";
import { Student } from "models/student";
import { getOccupation } from "models/work";
import { cn } from "utils";
import {
  useGlobalT,
  useGovT,
  usePageT,
  usePersonalInfoT,
} from "utils/translation";

import StudentNotes from "../StudentNotes";

interface StudentListProps {}

const StudentList: VFC<StudentListProps> = () => {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const stu = usePageT("students");
  const pi = usePersonalInfoT();

  const { data, fetchStudents, updateStudent } = useStudents();

  const { showPopup, closePopup } = usePopup();

  // Progress
  const updateProgress = (student: Student) => (status: Progress) => {
    updateStudent(student.id, { meta: { ...student.meta, progress: status } });
    closePopup();
  };

  // Subscription
  const updateSubscription =
    (student: Student) => (subscription: Subscription) => {
      updateStudent(student.id, { meta: { ...student.meta, subscription } });
      closePopup();
    };

  // Notes
  const showNotesPopup = (studentId: string) => () =>
    showPopup(<StudentNotes studentId={studentId} />);

  const fields: FieldProps[] = [
    {
      name: "gender",
      header: (
        <div
          className="tightCircle"
          style={{ border: "2px solid var(--c-black)" }}
        ></div>
      ),
      className: "prefix",
      getValue: ({ gender }: Student) => (
        <div className={cn("tightCircle", gender)}></div>
      ),
      fit: true,
    },
    {
      name: "name",
      header: pi("fullName"),
      className: "name",
      getValue: ({ firstName, middleName, lastName }: Student) =>
        `${firstName} ${middleName} ${lastName}`,
    },
    {
      name: "status",
      header: pi("status"),
      className: "statusButton",
      getValue: (data: Student) => {
        const {
          meta: { progress },
        } = data;

        return (
          <StatusSelector
            variant="progress"
            status={progress}
            onChange={updateProgress(data)}
          />
        );
      },
      fit: true,
    },
    {
      name: "subscription",
      header: pi("subscription"),
      className: "statusButton",
      getValue: (data: Student) => {
        const {
          meta: { subscription },
        } = data;

        return (
          <StatusSelector
            variant="subscription"
            status={subscription}
            onChange={updateSubscription(data)}
          />
        );
      },
      fit: true,
    },
    {
      name: "phoneNumber",
      header: pi("phoneNumber"),
      className: "phoneNumber",
      getValue: ({ phoneNumber, phoneNumbers }: any) =>
        getPhoneNumberByTag(phoneNumber || phoneNumbers, "whatsapp"),
      fit: true,
    },
    {
      name: "age",
      header: pi("age"),
      getValue: ({ dateOfBirth }: Student) => getAge(dateOfBirth),
      fit: true,
    },
    {
      name: "education",
      header: pi("education"),
    },
    {
      name: "occupation",
      header: pi("occupation"),
      getValue: ({ workStatus }: Student) => getOccupation(workStatus, pi),
    },
    {
      name: "nationality",
      header: pi("nationality"),
      getValue: ({ country }: Student) => getCountry(country)?.native,
    },
    {
      name: "residence",
      header: pi("residence"),
      getValue: ({ country, governorate }: Student) => {
        const parts = [getCountry(country)?.native];
        if (governorate) parts.push(handleEgGov(governorate, gov));
        return parts.join(" - ");
      },
    },
    {
      name: "course",
      header: glb("course"),
    },
    {
      name: "teacher",
      header: glb("teacher"),
    },
    {
      name: "schedule",
      header: glb("schedule"),
    },
    {
      name: "notes",
      header: glb("notes"),
      getValue: ({ id, notes }: Student) => {
        const lastNote = notes?.[0];

        return (
          <button
            className={cn({ createNote: !lastNote }, "note")}
            onClick={showNotesPopup(id)}
            dir="auto"
          >
            {lastNote?.body || ". . ."}
          </button>
        );
      },
    },
    {
      name: "dateCreated",
      header: glb("dateCreated"),
      getValue: ({ meta: { dateCreated } }: Student) => historyRep(dateCreated),
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
      <Button variant="gray-text" size="tight" onClick={() => fetchStudents()}>
        {glb("loadMore")}
      </Button>
    </main>
  );
};

export default StudentList;
