import { useMemo, VFC } from "react";
import { Trans } from "react-i18next";

import Container from "components/Container";
import EnrollLinks from "components/EnrollLinks";
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
  const msg = useMessageT("toast");

  const { openToast } = usePopupContext();
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
                  openToast(
                    <Trans t={msg} i18nKey="newTeacher">
                      <b>Success:</b> a new teacher was added!
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
