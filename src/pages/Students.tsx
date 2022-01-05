import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import StudentItem from "../components/StudentItem";
import Tabs from "../components/Tabs";
import { useStudents } from "../context/Students";

interface StudentsProps {}

const Students: FunctionComponent<StudentsProps> = () => {
  const { t } = useTranslation();
  const s = (value: string) => t(`students.${value}`);

  const tabs = ["pending", "existing", "archived"].map((name, index) => ({
    name: s(name),
    id: `st_${index}`,
  }));

  const [selectedTab, setSelectedTab] = useState(tabs[0].id);

  const { data, fetchStudents } = useStudents();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const addToSelected = (id: string) =>
    setSelectedItems((state) => [...state, id]);
  const removeFromSelected = (id: string) =>
    setSelectedItems((state) => state.filter((id$) => id$ !== id));

  useEffect(() => fetchStudents(), []);

  return (
    <div className="students">
      <Tabs
        elements={tabs}
        selected={selectedTab}
        onChange={(selection: string) => setSelectedTab(selection)}
        actions={
          <Link className="add-resource" to="/students/new">
            +
          </Link>
        }
      />
      <main className="main-body">
        {Object.keys(data).map((id) => (
          <StudentItem
            key={id}
            data={data[id]}
            selected={selectedItems.includes(id)}
            {...{ id, addToSelected, removeFromSelected }}
          />
        ))}
      </main>
    </div>
  );
};

export default Students;
