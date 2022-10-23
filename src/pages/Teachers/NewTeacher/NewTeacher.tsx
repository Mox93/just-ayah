import { useMemo, VFC } from "react";
import { Trans } from "react-i18next";

import Container from "components/Container";
import EnrollLinks from "components/EnrollLinks";
import { ErrorMessage, FlashCard } from "components/FlashMessages";
import {
  usePopupContext,
  useTeacherContext,
  useTeacherEnrollContext,
} from "context";
import { Tabs, useGlobalT, useMessageT, usePageT, useTabs } from "hooks";

import TeacherForm from "../TeacherForm";

interface NewTeacherProps {}

const NewTeacher: VFC<NewTeacherProps> = () => {
  const glb = useGlobalT();
  const tch = usePageT("teacher");
  const msg = useMessageT("teacher");

  const { openModal } = usePopupContext();
  const { addTeacher } = useTeacherContext();
  const enrollContext = useTeacherEnrollContext();

  const tabs = useMemo<Tabs>(
    () => [
      {
        key: "links",
        body: () => (
          <EnrollLinks enrollContext={enrollContext} linkKey="teachers" />
        ),
      },
      {
        key: "form",
        body: () => (
          <TeacherForm
            onSubmit={(data) => {
              addTeacher(data, {
                onFulfilled: () =>
                  openModal(
                    <FlashCard state="success">
                      <Trans t={msg} i18nKey="addSuccess">
                        <h1>
                          <span className="light">A New Teacher was Added</span>
                          <span className="accent">Successfully!</span>
                        </h1>
                      </Trans>
                    </FlashCard>,
                    { center: true, closable: true }
                  ),
                onRejected: (reason) =>
                  openModal(<ErrorMessage error={reason} />, {
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
      className="NewTeacher"
      header={
        <>
          <h2 className="title">{tch("newTeachers")}</h2>
          {tabsHeader}
        </>
      }
    >
      {tabsBody}
    </Container>
  );
};

export default NewTeacher;
