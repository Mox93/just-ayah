import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import LanguageSelector from "components/LanguageSelector";
import { useAuth } from "context/Auth";
import { ReactComponent as HomeIcon } from "assets/icons/home-svgrepo-com.svg";
import { ReactComponent as StudentsIcon } from "assets/icons/group-of-students-svgrepo-com.svg";
import { ReactComponent as TeachersIcon } from "assets/icons/teacher-svgrepo-com.svg";
import { ReactComponent as CoursesIcon } from "assets/icons/closed-book-svgrepo-com.svg";

import { useDirT, useGlobalT, useNavT } from "utils/translation";
import { cn } from "utils";

interface SideBarProps {}

const SideBar: FunctionComponent<SideBarProps> = () => {
  const dir = useDirT();
  const glb = useGlobalT();
  const nav = useNavT();

  const { signOut } = useAuth();

  const classHandler = ({ isActive }: { isActive: boolean }) =>
    cn({ selected: isActive }, "element");

  return (
    <div className="SideBar" dir={dir}>
      <div className="navSection">
        <NavLink className={classHandler} to="/">
          <h3 className="expanded">{nav("home")}</h3>
          <HomeIcon className="shrunk" />
        </NavLink>
        <NavLink className={classHandler} to="/students">
          <h3 className="expanded">{nav("students")}</h3>
          <StudentsIcon className="shrunk" />
        </NavLink>
        <NavLink className={classHandler} to="/teachers">
          <h3 className="expanded">{nav("teachers")}</h3>
          <TeachersIcon className="shrunk" />
        </NavLink>
        <NavLink className={classHandler} to="/courses">
          <h3 className="expanded">{nav("courses")}</h3>
          <CoursesIcon className="shrunk" />
        </NavLink>
      </div>
      <div className="settingsSection">
        <LanguageSelector />
        <button className="signOut" onClick={signOut}>
          {glb("signOut")}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
