import { FunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <div className="side-bar" dir={t("dir")}>
      <div className="nav-section">
        <Link
          className={cn({ selected: location.pathname === "/" }, "element")}
          to="/"
        >
          <h3 className="expanded">{t("nav.home")}</h3>
          <SvgIcon href={`${HomeIcon}/#Capa_1`}></SvgIcon>
        </Link>
        <Link
          className={cn(
            { selected: location.pathname.startsWith("/students") },
            "element"
          )}
          to="/students"
        >
          <h3 className="expanded">{t("nav.students")}</h3>
          <SvgIcon href={`${StudentsIcon}/#Capa_1`}></SvgIcon>
        </Link>
        <Link
          className={cn(
            { selected: location.pathname.startsWith("/teachers") },
            "element"
          )}
          to="/teachers"
        >
          <h3 className="expanded">{t("nav.teachers")}</h3>
          <SvgIcon href={`${TeachersIcon}/#Capa_1`}></SvgIcon>
        </Link>
        <Link
          className={cn(
            { selected: location.pathname.startsWith("/courses") },
            "element"
          )}
          to="/courses"
        >
          <h3 className="expanded">{t("nav.courses")}</h3>
          <SvgIcon href={`${CoursesIcon}/#Capa_1`}></SvgIcon>
        </Link>
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
