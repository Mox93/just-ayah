import { deleteField } from "firebase/firestore";
import { lazy, useCallback, useMemo } from "react";

import { ReactComponent as Info } from "assets/icons/info-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Ellipsis from "components/Ellipsis";
import { CourseMenu, StatusMenu, TeacherMenu } from "components/DropdownMenu";
import { FieldProps } from "components/Table";
import { usePopupContext, useStudentContext } from "context";
import { useDateTimeT, useGlobalT, useGovT, usePersonalInfoT } from "hooks";
import { Path, PathValue } from "models";
import { getAge, historyRep } from "models/_blocks";
import {
  workStatusString,
  findPhoneNumberByTags,
  handleEgGov,
  scheduleBrief,
  phoneNumberString,
} from "models/blocks";
import Student from "models/student";
import { cn, concat } from "utils";

const StudentNotes = lazy(() => import("../StudentNotes"));
const StudentSchedule = lazy(() => import("../StudentSchedule"));

export function useTableFields() {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const pi = usePersonalInfoT();
  const swd = useDateTimeT("weekDay.short");
  const dt = useDateTimeT();

  const { openModal } = usePopupContext();
  const { updateStudent } = useStudentContext();

  const showNotesPopup = useCallback(
    (id: string) => () =>
      openModal(<StudentNotes id={id} />, {
        closable: true,
        dismissible: true,
      }),
    [openModal]
  );

  const showSchedulePopup = useCallback(
    (id: string) => () =>
      openModal(<StudentSchedule id={id} />, {
        closable: true,
        dismissible: true,
      }),
    [openModal]
  );

  const updateField = useCallback(
    <TKey extends Path<Student>>(name: TKey, id: string) =>
      (value?: PathValue<Student, TKey>) =>
        updateStudent(
          id,
          {
            [name]: value || (deleteField() as any),
          },
          { applyLocally: true }
        ),
    [updateStudent]
  );

  return useMemo<FieldProps<Student>[]>(
    () => [
      {
        name: "name",
        header: pi("fullName"),
        className: "name",
        getValue: ({ data: { firstName, middleName, lastName } }) =>
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
        getValue: ({ data: { phoneNumber } }) =>
          phoneNumberString(findPhoneNumberByTags(phoneNumber, ["whatsapp"])),
        fit: true,
      },
      {
        name: "age",
        header: pi("age"),
        getValue: ({ data: { dateOfBirth } }) => getAge(dateOfBirth),
        fit: true,
      },
      {
        name: "education",
        header: pi("education"),
      },
      {
        name: "occupation",
        header: pi("occupation"),
        getValue: ({ data: { workStatus } }) =>
          workStatusString(workStatus, pi),
      },
      {
        name: "nationality",
        header: pi("nationality"),
        getValue: ({
          data: {
            country: { native },
          },
        }) => native,
      },
      {
        name: "residence",
        header: pi("residence"),
        getValue: ({
          data: {
            country: { native },
            governorate,
          },
        }) => {
          const parts = [native];
          if (governorate) parts.push(handleEgGov(governorate, gov));
          return parts.join(" - ");
        },
      },
      {
        name: "course",
        header: glb("course"),
        className: "buttonCell",
        getValue: ({ id, meta: { course } }) => (
          <CourseMenu
            selected={course}
            onOptionChange={updateField("meta.course", id)}
          />
        ),
      },
      {
        name: "teacher",
        header: glb("teacher"),
        className: "buttonCell name",
        getValue: ({ id, meta: { teacher } }) => (
          <TeacherMenu
            selected={teacher}
            onOptionChange={updateField("meta.teacher", id)}
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
    [dt, glb, gov, pi, showNotesPopup, showSchedulePopup, swd, updateField]
  );
}
