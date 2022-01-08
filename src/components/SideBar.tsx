import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HomeIcon from "../assets/icons/home-svgrepo-com.svg";
import StudentsIcon from "../assets/icons/group-of-students-svgrepo-com.svg";
import TeachersIcon from "../assets/icons/teacher-svgrepo-com.svg";
import CoursesIcon from "../assets/icons/closed-book-svgrepo-com.svg";
import { cn } from "../utils";
import SvgIcon from "./SvgIcon";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../context/Auth";

interface SideBarProps {}

const SideBar: FunctionComponent<SideBarProps> = () => {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const classHandler = ({ isActive }: { isActive: boolean }) =>
    cn({ selected: isActive }, "element");

  return (
    <div className="side-bar" dir={t("dir")}>
      <div className="nav-section">
        <NavLink className={classHandler} to="/">
          <h3 className="expanded">{t("nav.home")}</h3>
          <SvgIcon className="shrunk" path={HomeIcon} />
        </NavLink>
        <NavLink className={classHandler} to="/students">
          <h3 className="expanded">{t("nav.students")}</h3>
          <SvgIcon className="shrunk" path={StudentsIcon} />
        </NavLink>
        <NavLink className={classHandler} to="/teachers">
          <h3 className="expanded">{t("nav.teachers")}</h3>
          <SvgIcon className="shrunk" path={TeachersIcon} />
        </NavLink>
        <NavLink className={classHandler} to="/courses">
          <h3 className="expanded">{t("nav.courses")}</h3>
          <SvgIcon className="shrunk" path={CoursesIcon} />
        </NavLink>
      </div>
      <div className="settings-section">
        <LanguageSelector />
        <button className="sign-out" onClick={signOut}>
          {t("elements.sign_out")}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
