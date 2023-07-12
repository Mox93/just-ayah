import { Outlet } from "react-router-dom";

import { useApplyOnce, useLanguage } from "hooks";

export default function Temp() {
  const [, setLanguage] = useLanguage();

  useApplyOnce(() => {
    setLanguage("ar");
  }, !JSON.parse(localStorage.getItem("manualLngChange") || "false"));

  return <Outlet />;
}
