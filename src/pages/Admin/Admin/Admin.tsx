import { Outlet } from "react-router-dom";

import { Await } from "components/Await";
import { useApplyOnce } from "hooks";
import { usePopupContext } from "context";
import { IS_PROD } from "models/config";

import Navbar from "../Navbar/Navbar";

export default function Admin() {
  const { openToast } = usePopupContext();

  useApplyOnce(
    () =>
      openToast(
        <>
          <span>
            This app is still in its development phase so there will be a lot
            changes in the future. I'd appreciate your feedback and ideas to
            improve the app. If you're facing any issues, please contact me
            right away.
          </span>
          <br />
          <b>email: mohamed.ragaiy.saleh@gmail.com</b>
        </>,
        { dir: "ltr" }
      ),
    IS_PROD
  );

  return (
    <Await>
      <Navbar />
      <Outlet />
    </Await>
  );
}
