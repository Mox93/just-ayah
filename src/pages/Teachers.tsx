import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";
import Tabs from "../components/Tabs";

interface TeachersProps {}

const Teachers: FunctionComponent<TeachersProps> = () => {
  const { t } = useTranslation();
  const tt = (value: string) => t(`teachers.${value}`);

  const tabs = ["existing", "archived"].map((name, index) => ({
    id: `te_${index}`,
    name,
    value: tt(name),
  }));

  const [selected, setSelected] = useState(tabs[0].id);

  return (
    <div>
      <Tabs
        elements={tabs}
        selected={selected}
        onChange={(selection: string) => setSelected(selection)}
        actions={
          <Link className="add-resource" to="/teachers/new">
            +
          </Link>
        }
      />
      <Outlet />
    </div>
  );
};

export default Teachers;
