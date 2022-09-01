import { ReactNode, useState, VFC } from "react";

import Container from "components/Container";
import { cn } from "utils";

import EnrollLinks from "../EnrollLinks";
import StudentForm from "../StudentForm";
import { useGlobalT, usePageT } from "hooks";

interface Tab {
  head: string;
  body: ReactNode;
  config?: Record<string, any>;
}

const tabs: Tab[] = [
  {
    head: "links",
    body: <EnrollLinks />,
  },
  {
    head: "form",
    body: <StudentForm />,
  },
];

interface NewStudentProps {}

const NewStudent: VFC<NewStudentProps> = () => {
  const glb = useGlobalT();
  const stu = usePageT("students");

  const [selectedTab, setSelectedTab] = useState("links");

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
