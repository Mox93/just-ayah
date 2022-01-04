import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="home" dir={t("dir")}>
      <SideBar />
      {location.pathname === "/" ? <h1>Home</h1> : <Outlet />}
    </div>
  );
};

export default Home;
