import { VFC } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "components/Sidebar";
import { useDirT } from "hooks";

interface AdminProps {}

const Admin: VFC<AdminProps> = () => {
  const dirT = useDirT();

  return (
    <div className="Admin" dir={dirT}>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Admin;
