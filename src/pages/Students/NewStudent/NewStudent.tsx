import { useMemo, VFC } from "react";
import { Trans } from "react-i18next";

import Container from "components/Container";
import EnrollLinks from "components/EnrollLinks";
import {
  usePopupContext,
  useStudentContext,
  useStudentEnrollContext,
} from "context";
import { Tabs, useGlobalT, useMessageT, usePageT, useTabs } from "hooks";

import StudentForm from "../StudentForm";

interface NewStudentProps {}

const NewStudent: VFC<NewStudentProps> = () => {
  const glb = useGlobalT();
  const stu = usePageT("student");
  const msg = useMessageT("toast");

  const { openToast } = usePopupContext();
  const { addStudent } = useStudentContext();
  const enrollContext = useStudentEnrollContext();

  const tabs = useMemo<Tabs>(
    () => [
      {
        key: "links",
        body: () => (
          <EnrollLinks enrollContext={enrollContext} linkKey="students" />
        ),
      },
      {
        key: "form",
        body: () => (
          <StudentForm
            onSubmit={(data) => {
              addStudent(data, {
                onFulfilled: () =>
                  openToast(
                    <Trans t={msg} i18nKey="newStudent">
                      <b>Success:</b> a new student was added!
                    </Trans>,
                    { variant: "success" }
                  ),
                onRejected: (reason) =>
                  openToast(
                    <>
                      <Trans t={msg} i18nKey="error">
                        <b>Error:</b> something went wrong!
                      </Trans>
                      {`\n${reason}`}
                    </>,
                    {
                      variant: "danger",
                    }
                  ),
              });
            }}
          />
        ),
      },
    ],
    [enrollContext, msg]
  );

  const [tabsHeader, tabsBody] = useTabs({ tabs, renderHeader: glb });

  return (
    <Container
      variant="card"
      className="NewStudent"
      header={
        <>
          <h2 className="title">{stu("newStudents")}</h2>
          {tabsHeader}
        </>
      }
    >
      {tabsBody}
    </Container>
  );
};

export default NewStudent;
