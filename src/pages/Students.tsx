import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StudentItem from "../components/StudentItem";
import Tabs from "../components/Tabs";
import { useStudents } from "../context/Students";

interface StudentsProps {}

const Students: FunctionComponent<StudentsProps> = () => {
  const { t } = useTranslation();
  const s = (value: string) => t(`students.${value}`);

  const mainTabs = ["pending", "existing", "archived"];

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

  const { data, fetchStudents, archiveStudent } = useStudents();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const addToSelected = (id: string) =>
    setSelectedItems((state) => [...state, id]);
  const removeFromSelected = (id: string) =>
    setSelectedItems((state) => state.filter((id$) => id$ !== id));

  useEffect(() => fetchStudents(selectedTab.name), [selectedTab]);

  return (
    <div className="students">
      <Tabs
        elements={tabs}
        selected={selectedTab.id}
        onChange={(selection: string) => {
          const selected = tabs.find((tab) => tab.id === selection);
          if (selected) setSelectedTab(selected);
        }}
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
      <main className="main-body">
        {data.map((student) => (
          <StudentItem
            key={student.id}
            data={student}
            selected={selectedItems.includes(student.id)}
            select={(checked) =>
              checked
                ? addToSelected(student.id)
                : removeFromSelected(student.id)
            }
            archive={() => archiveStudent(student)}
          />
        ))}
      </main>
    </div>
  );
};

export default Students;
