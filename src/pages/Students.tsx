import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";
import Tabs from "../components/Tabs";

interface StudentsProps {}

const Students: FunctionComponent<StudentsProps> = () => {
  const { t } = useTranslation();
  const s = (value: string) => t(`students.${value}`);

  const tabs = ["pending", "existing", "archived"].map((name, index) => ({
    name: s(name), id: `st_${index}`
  }))

  const [selected, setSelected] = useState(tabs[0].id);

  return (
    <div className="students">
      <Tabs
        elements={tabs}
        selected={selected}
        onChange={(selection: string) => setSelected(selection)}
        actions={<Link className="add-resource" to="/students/new" >+</Link>}
      />
      <Outlet />
    </div>
  );
};

export default Students;
