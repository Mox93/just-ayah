import { deleteField } from "firebase/firestore";
import { useEffect, useMemo, useState, VFC } from "react";
import { FieldPath, FieldPathValue } from "react-hook-form";

import { ReactComponent as Info } from "assets/icons/info-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { SelectionMenu } from "components/DropdownMenu";
import Ellipsis, { ellipsis } from "components/Ellipsis";
import { StatusMenu } from "components/DropdownMenu";
import { FieldProps, Table } from "components/Table";
import {
  useCourseContext,
  useMetaContext,
  usePopupContext,
  useStudentContext,
} from "context";
import {
  useDateTimeT,
  useGlobalT,
  useGovT,
  useLoading,
  usePageT,
  usePersonalInfoT,
} from "hooks";
import { getCountry } from "models/country";
import { getAge, historyRep } from "models/dateTime";
import { handleEgGov } from "models/governorate";
import { getPhoneNumberByTag } from "models/phoneNumber";
import { scheduleBrief } from "models/schedule";
import { Student } from "models/student";
import { getOccupation } from "models/work";
import { cn, concat, prodOnly } from "utils";

import StudentNotes from "../StudentNotes";
import StudentSchedule from "../StudentSchedule";

interface StudentListProps {}

const StudentList: VFC<StudentListProps> = () => {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const stu = usePageT("student");
  const pi = usePersonalInfoT();
  const swd = useDateTimeT("weekDay.short");
  const dt = useDateTimeT();

  const { students, fetchStudents, updateStudent } = useStudentContext();

  const {
    data: { courses },
  } = useCourseContext();

  const {
    shortList: { teachers = [] },
  } = useMetaContext();

  const { showPopup } = usePopupContext();

  const showNotesPopup = (id: string) => () =>
    showPopup(<StudentNotes id={id} />, { closable: true, dismissible: true });

  const showSchedulePopup = (id: string) => () =>
    showPopup(<StudentSchedule id={id} />, {
      closable: true,
      dismissible: true,
    });

  const updateField =
    <TKey extends FieldPath<Student>>(name: TKey, id: string) =>
    (value?: FieldPathValue<Student, TKey>) =>
      updateStudent(
        id,
        {
          [name]: value || (deleteField() as any),
        },
        { applyLocally: true }
      );

  const fields = useMemo<FieldProps<Student>[]>(
    () => [
      {
        name: "name",
        header: pi("fullName"),
        className: "name",
        getValue: ({ firstName, middleName, lastName }) =>
          concat(firstName, middleName, lastName),
      },
      {
        name: "status",
        header: glb("status"),
        className: "buttonCell",
        getValue: ({ id, meta: { progress } }) => {
          return (
            <StatusMenu
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
        header: glb("subscription"),
        className: "buttonCell",
        getValue: ({ id, meta: { subscription } }) => {
          return (
            <StatusMenu
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
        getValue: ({ phoneNumber }) =>
          getPhoneNumberByTag(phoneNumber, "whatsapp"),
        fit: true,
      },
      {
        name: "age",
        header: pi("age"),
        getValue: ({ dateOfBirth }) => getAge(dateOfBirth),
        fit: true,
      },
      {
        name: "education",
        header: pi("education"),
      },
      {
        name: "occupation",
        header: pi("occupation"),
        getValue: ({ workStatus }) => getOccupation(workStatus, pi),
      },
      {
        name: "nationality",
        header: pi("nationality"),
        getValue: ({ country }) => getCountry(country)?.native,
      },
      {
        name: "residence",
        header: pi("residence"),
        getValue: ({ country, governorate }) => {
          const parts = [getCountry(country)?.native];
          if (governorate) parts.push(handleEgGov(governorate, gov));
          return parts.join(" - ");
        },
      },
      {
        name: "course",
        header: glb("course"),
        className: "buttonCell",
        getValue: ({ id, meta: { course } }) => (
          <SelectionMenu
            selected={course}
            options={courses}
            size="small"
            setValue={updateField("meta.course", id)}
            renderElement={ellipsis()}
          />
        ),
      },
      {
        name: "teacher",
        header: glb("teacher"),
        className: "buttonCell",
        getValue: ({ id, meta: { teacher } }) => (
          <SelectionMenu
            selected={teacher}
            options={teachers}
            size="small"
            setValue={updateField("meta.teacher", id)}
            renderElement={ellipsis()}
          />
        ),
      },
      {
        name: "schedule",
        header: glb("schedule"),
        className: "buttonCell",
        getValue: ({ id, meta: { schedule } }) => {
          const brief = scheduleBrief(schedule, swd, dt);

          return (
            <Button
              variant="plain-text"
              size="small"
              onClick={showSchedulePopup(id)}
            >
              <Ellipsis className={cn({ empty: !brief })}>
                {brief || ". . ."}
              </Ellipsis>
              {schedule?.notes && <Info className="infoIcon iconS" />}
            </Button>
          );
        },
      },
      {
        name: "notes",
        header: glb("notes"),
        className: "buttonCell",
        getValue: ({ id, meta: { notes: [lastNote] = [] } }) => (
          <Button
            variant="plain-text"
            size="small"
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
        getValue: ({ meta: { dateCreated } }) => historyRep(dateCreated),
        fit: true,
      },
    ],
    [teachers, courses]
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (id: string) =>
    setSelected((state) => new Set(state.add(id)));
  const handleDeselect = (id: string) =>
    setSelected((state) => {
      state.delete(id);
      return new Set(state);
    });

  const [loadStudents, isLoading] = useLoading((stopLoading) => {
    fetchStudents({
      options: { onFulfilled: stopLoading, onRejected: stopLoading },
    });
  });

  useEffect(() => {
    prodOnly(() => {
      if (!students.length) loadStudents();
    })();
  }, []);

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
        extraProps={({ gender }) => ({ gender })}
        footer={
          <Button
            className="loadMore"
            variant="gray-text"
            onClick={loadStudents}
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
