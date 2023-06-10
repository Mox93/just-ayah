import { Outlet } from "react-router-dom";

import { Await } from "components/Await";
import { useHeaderProps, usePopupContext } from "context";
import { useApplyOnce } from "hooks";
import { IS_PROD } from "models/config";

import Header from "../Header";
import Navbar from "../Navbar";

export default function Admin() {
  const { openToast } = usePopupContext();

  useApplyOnce(
    () =>
      openToast(
        <>
          <span>
            This app is still under development so it's expected things will
            change along the way. Your feedback and ideas to improve the app
            would be greatly appreciated. If you're facing any issues, don't
            hesitate to get in touch right away.
          </span>
          <br />
          <b>email: mohamed.ragaiy.saleh@gmail.com</b>
        </>,
        { dir: "ltr" }
      ),
    IS_PROD
  );

  return (
    <>
      <Navbar />
      <Header {...useHeaderProps()} />
      <main className="Admin followSidebar">
        <Await>
          <Outlet />
        </Await>
      </main>
    </>
  );
}
