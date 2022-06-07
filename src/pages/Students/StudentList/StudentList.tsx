import { deleteField } from "firebase/firestore";
import { useState, VFC } from "react";
import { FieldPath, FieldPathValue } from "react-hook-form";

import { Button } from "components/Buttons";
import DropdownMenu from "components/DropdownMenu";
import Ellipsis, { ellipsis } from "components/Ellipsis";
import StatusSelector from "components/StatusSelector";
import Table, { FieldProps } from "components/Table";
import {
  useCourseContext,
  usePopupContext,
  useStudentContext,
  useTeacherContext,
} from "context";
import { useGlobalT, useGovT, usePageT, usePersonalInfoT } from "hooks";
import { getCountry } from "models/country";
import { getAge, historyRep } from "models/dateTime";
import { handleEgGov } from "models/governorate";
import { getPhoneNumberByTag } from "models/phoneNumber";
import { Student } from "models/student";
import { getOccupation } from "models/work";
import { cn } from "utils";

import StudentNotes from "../StudentNotes";

interface StudentListProps {}

const StudentList: VFC<StudentListProps> = () => {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const stu = usePageT("students");
  const pi = usePersonalInfoT();

  const {
    data: { students },
    fetch,
    update,
  } = useStudentContext();

  const {
    data: { courses },
  } = useCourseContext();

  const {
    data: { teacherList },
  } = useTeacherContext();

  const { showPopup } = usePopupContext();

  // Notes
  const showNotesPopup = (studentId: string) => () =>
    showPopup(<StudentNotes studentId={studentId} />);

  const updateField =
    <TKey extends FieldPath<Student>>(name: TKey, id: string) =>
    (value?: FieldPathValue<Student, TKey>) =>
      update(id, {
        [name]: value || (deleteField() as any),
      });

  const fields: FieldProps[] = [
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
      className: "buttonCell",
      getValue: ({ id, meta: { progress } }: Student) => {
        return (
          <StatusSelector
            variant="progress"
            status={progress}
            onChange={updateField("meta.progress", id)}
          />
        );
      },
      fit: true,
    },
    {
      name: "subscription",
      header: pi("subscription"),
      className: "buttonCell",
      getValue: ({ id, meta: { subscription } }: Student) => {
        return (
          <StatusSelector
            variant="subscription"
            status={subscription}
            onChange={updateField("meta.subscription", id)}
          />
        );
      },
      fit: true,
    },
    {
      name: "phoneNumber",
      header: pi("phoneNumber"),
      className: "phoneNumber",
      getValue: (
        { phoneNumber, phoneNumbers }: any // TODO update field name in fireStore
      ) => getPhoneNumberByTag(phoneNumber || phoneNumbers, "whatsapp"),
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
      className: "buttonCell",
      getValue: ({ id, course }: Student) => (
        <DropdownMenu
          className="mutableValue"
          selected={course}
          options={courses}
          size="small"
          setValue={updateField("course", id)}
          renderElement={ellipsis()}
        />
      ),
    },
    {
      name: "teacher",
      header: glb("teacher"),
      className: "buttonCell",
      getValue: ({ id, teacher }: Student) => (
        <DropdownMenu
          className="mutableValue"
          selected={teacher}
          options={teacherList}
          size="small"
          setValue={updateField("teacher", id)}
          renderElement={ellipsis()}
        />
      ),
    },
    {
      name: "schedule",
      header: glb("schedule"),
    },
    {
      name: "notes",
      header: glb("notes"),
      className: "buttonCell",
      getValue: ({ id, notes: [lastNote, ..._] = [] }: Student) => (
        <Button
          variant="plain-text"
          size="small"
          className="mutableValue"
          onClick={showNotesPopup(id)}
          dir="auto"
        >
          <Ellipsis className={cn({ empty: !lastNote })}>
            {lastNote?.body || ". . ."}
          </Ellipsis>
        </Button>
      ),
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
    <div className="StudentList">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ fields, selected }}
        data={students}
        toggleSelect={(checked, id) =>
          checked ? handleSelect(id) : handleDeselect(id)
        }
        toggleSelectAll={(checked) =>
          setSelected(
            checked ? new Set(students.map(({ id }) => id)) : new Set()
          )
        }
        extraProps={(data: Student) => ({ gender: data.gender })}
        footer={
          <Button
            className="loadMore"
            variant="gray-text"
            onClick={() => fetch()}
          >
            {glb("loadMore")}
          </Button>
        }
      ></Table>
    </div>
  );
};

export default StudentList;
