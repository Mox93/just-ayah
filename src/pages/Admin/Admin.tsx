import { VFC } from "react";
import { Outlet } from "react-router-dom";

import SideBar from "components/SideBar";
import { useDirT } from "utils/translation";

interface AdminProps {}

const Admin: VFC<AdminProps> = () => {
  const dir = useDirT();

  return (
    <div className="Admin" dir={dir}>
      <SideBar />
      <Outlet />
    </div>
  );
};

export default Admin;
