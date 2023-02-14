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
      <>
        <span>
          This app is still in its development phase so there will be a lot
          changes in the future. I'd appreciate your feedback and ideas to
          improve the app. If you're facing any issues, please contact me right
          away.
        </span>
        <br />
        <b>email: mohamed.ragaiy.saleh@gmail.com</b>
      </>,
      { dir: "ltr" }
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
