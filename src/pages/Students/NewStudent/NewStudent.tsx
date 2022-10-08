import { useMemo, VFC } from "react";
import { Trans } from "react-i18next";

import Container from "components/Container";
import EnrollLinks from "components/EnrollLinks";
import { ErrorMessage, FlashCard } from "components/FlashMessages";
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
  const msg = useMessageT("student");

  const { showPopup } = usePopupContext();
  const { addStudent } = useStudentContext();
  const enrollContext = useStudentEnrollContext();

  const tabs = useMemo<Tabs>(
    () => [
      {
        key: "links",
        body: () => <EnrollLinks enrollContext={enrollContext} />,
      },
      {
        key: "form",
        body: () => (
          <StudentForm
            onSubmit={(data) => {
              addStudent(data, {
                onFulfilled: () =>
                  showPopup(
                    <FlashCard state="success">
                      <Trans t={msg} i18nKey="addSuccess">
                        <h1>
                          <span className="light">A New Student was Added</span>
                          <span className="accent">Successfully!</span>
                        </h1>
                      </Trans>
                    </FlashCard>,
                    { center: true, closable: true }
                  ),
                onRejected: (reason) =>
                  showPopup(<ErrorMessage error={reason} />, {
                    center: true,
                    closable: true,
                  }),
              });
            }}
          />
        ),
      },
    ],
    [enrollContext]
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
