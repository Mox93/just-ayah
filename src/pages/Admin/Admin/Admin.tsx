import { useEffect, VFC } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "components/Sidebar";
import { useDirT } from "hooks";
import { usePopupContext } from "context";

interface AdminProps {}

const Admin: VFC<AdminProps> = () => {
  const dirT = useDirT();

  const { openToast } = usePopupContext();

  useEffect(() => {
    openToast(
      "Welcome to the admin dashboard, we are very happy that you are using out app. Bla bla bla. Bla bla bla. Bla bla bla \nThis is a test message..."
    );
  }, []);

  return (
    <div className="Admin" dir={dirT}>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Admin;
