import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import SvgIcon from "components/SvgIcon";
import LanguageSelector from "components/LanguageSelector";
import { useAuth } from "context/Auth";
import HomeIcon from "assets/icons/home-svgrepo-com.svg";
import StudentsIcon from "assets/icons/group-of-students-svgrepo-com.svg";
import TeachersIcon from "assets/icons/teacher-svgrepo-com.svg";
import CoursesIcon from "assets/icons/closed-book-svgrepo-com.svg";
import { cn } from "utils";

import { useDirT, useGlobalT, useNavT } from "utils/translation";

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
      <div className="nav-section">
        <NavLink className={classHandler} to="/">
          <h3 className="expanded">{nav("home")}</h3>
          <SvgIcon className="shrunk" path={HomeIcon} />
        </NavLink>
        <NavLink className={classHandler} to="/students">
          <h3 className="expanded">{nav("students")}</h3>
          <SvgIcon className="shrunk" path={StudentsIcon} />
        </NavLink>
        <NavLink className={classHandler} to="/teachers">
          <h3 className="expanded">{nav("teachers")}</h3>
          <SvgIcon className="shrunk" path={TeachersIcon} />
        </NavLink>
        <NavLink className={classHandler} to="/courses">
          <h3 className="expanded">{nav("courses")}</h3>
          <SvgIcon className="shrunk" path={CoursesIcon} />
        </NavLink>
      </div>
      <div className="settings-section">
        <LanguageSelector />
        <button className="sign-out" onClick={signOut}>
          {glb("signOut")}
        </button>
      </div>
    </div>
  );
};

export default SideBar;