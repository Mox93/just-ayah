import { VFC } from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as HomeIcon } from "assets/icons/home-svgrepo-com.svg";
import { ReactComponent as StudentsIcon } from "assets/icons/group-of-students-svgrepo-com.svg";
import { ReactComponent as TeachersIcon } from "assets/icons/teacher-svgrepo-com.svg";
import { ReactComponent as CoursesIcon } from "assets/icons/closed-book-svgrepo-com.svg";
import { Button } from "components/Buttons";
import LanguageSelector from "components/LanguageSelector";
import { useAuthContext } from "context";
import { useDirT, useGlobalT, useNavT } from "hooks";
import { cn } from "utils";

interface SidebarProps {}

const Sidebar: VFC<SidebarProps> = () => {
  const dirT = useDirT();
  const glb = useGlobalT();
  const nav = useNavT();

  const { signOut } = useAuthContext();

  const classHandler = ({ isActive }: { isActive: boolean }) =>
    cn({ selected: isActive }, "element");

  return (
    <div className="Sidebar" dir={dirT}>
      <div className="navSection">
        <NavLink className={classHandler} to="/admin">
          <h4 className="label">{nav("home")}</h4>
          <HomeIcon className="icon" />
        </NavLink>
        <NavLink className={classHandler} to="/admin/students">
          <h4 className="label">{nav("students")}</h4>
          <StudentsIcon className="icon" />
        </NavLink>
        <NavLink className={classHandler} to="/admin/teachers">
          <h4 className="label">{nav("teachers")}</h4>
          <TeachersIcon className="icon" />
        </NavLink>
        <NavLink className={classHandler} to="/admin/courses">
          <h4 className="label">{nav("courses")}</h4>
          <CoursesIcon className="icon" />
        </NavLink>
      </div>
      <div className="settingsSection">
        <LanguageSelector />
        <Button variant="danger-solid" className="signOut" onClick={signOut}>
          {glb("signOut")}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
