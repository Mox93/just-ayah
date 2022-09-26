import { ReactNode, useMemo, useState, VFC } from "react";
import { Trans } from "react-i18next";

import Container from "components/Container";
import FlashMessage from "components/FlashMessage";
import { usePopupContext, useStudentContext } from "context";
import { useGlobalT, useMessageT, usePageT } from "hooks";
import { StudentInfo } from "models/student";
import { cn } from "utils";

import EnrollLinks from "../EnrollLinks";
import StudentForm from "../StudentForm";

interface Tab {
  head: string;
  body: ReactNode;
}

interface NewStudentProps {}

const NewStudent: VFC<NewStudentProps> = () => {
  const glb = useGlobalT();
  const stu = usePageT("student");
  const msg = useMessageT("student");

  const [selectedTab, setSelectedTab] = useState("links");

  const { showPopup } = usePopupContext();
  const { addStudent } = useStudentContext();

  const tabs: Tab[] = useMemo(
    () => [
      {
        head: "links",
        body: <EnrollLinks />,
      },
      {
        head: "form",
        body: (
          <StudentForm
            onSubmit={(data: StudentInfo) => {
              addStudent(data, {
                onFulfilled: () =>
                  showPopup(
                    <FlashMessage state="success">
                      <Trans t={msg} i18nKey="addSuccess">
                        <h1>
                          <span className="light">A New Student was Added</span>
                          <span className="accent">Successfully!</span>
                        </h1>
                      </Trans>
                    </FlashMessage>,
                    { center: true, closable: true }
                  ),
                onRejected: (reason) =>
                  showPopup(
                    <FlashMessage state="error">
                      <Trans t={msg} i18nKey="addFail">
                        <h2 className="accent">Something Went Wrong!</h2>
                        <p>Please try again later.</p>
                      </Trans>

                      <div className="code">
                        <code>{JSON.stringify(reason, null, 2)}</code>
                      </div>
                    </FlashMessage>,
                    { center: true, closable: true }
                  ),
              });
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <Container
      variant="card"
      className="NewStudent"
      header={
        <>
          <h2 className="title">{stu("newStudents")}</h2>
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.head}
                className={cn("tabButton", {
                  selected: tab.head === selectedTab,
                })}
                onClick={() => setSelectedTab(tab.head)}
              >
                {glb(tab.head)}
              </button>
            ))}
          </div>
        </>
      }
    >
      {tabs.find((tab) => tab.head === selectedTab)?.body}
    </Container>
  );
};

export default NewStudent;
