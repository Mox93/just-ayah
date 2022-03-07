import { FunctionComponent } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "components/SideBar";
import { useDirT } from "utils/translation";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const dir = useDirT();
  const location = useLocation();

  return (
    <div className="home" dir={dir}>
      <SideBar />
      {location.pathname === "/" ? <h1>Home</h1> : <Outlet />}
    </div>
  );
};

export default Home;
