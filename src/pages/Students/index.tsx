import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StudentList from "./StudentList";
import Tabs from "components/Tabs";
import { useStudents } from "context/Students";
import useRequestGuard from "utils/requestGuard";

interface StudentsProps {}

const Students: FunctionComponent<StudentsProps> = () => {
  /* TRANSLATION */
  const { t } = useTranslation();
  const s = (value: string) => t(`students.${value}`);

  /* TABS */
  const mainTabs = ["pending", "active", "archived"];
  const createTab = (name: string, index: number, staticTab: boolean = true) =>
    staticTab
      ? {
          id: `st_${index}`,
          name,
          value: s(name),
        }
      : {
          id: `st_${index}`,
          name,
          value: name,
        };
  const [tabs, setTabs] = useState(() =>
    mainTabs.map((name, index) => createTab(name, index))
  );
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleTabSelection = (selection: string) => {
    const selected = tabs.find((tab) => tab.id === selection);
    if (selected) setSelectedTab(selected);
  };

  const { data, fetchStudents } = useStudents();

  const [canFetch, ToggleButton] = useRequestGuard();

  useEffect(() => {
    if (canFetch) fetchStudents(selectedTab.name);
  }, [selectedTab, canFetch]);

  return (
    <div className="students">
      <Tabs
        elements={tabs}
        selected={selectedTab.id}
        onChange={handleTabSelection}
        actions={
          <button
            className="add-resource"
            onClick={() => {
              let selected = createTab("new", tabs.length, false);

              setTabs((tabs) => [...tabs, selected]);
              setSelectedTab(selected);
            }}
          >
            +
          </button>
        }
      />
      <main className="main-section">
        {ToggleButton}
        <StudentList data={data} />
      </main>
    </div>
  );
};

export default Students;
