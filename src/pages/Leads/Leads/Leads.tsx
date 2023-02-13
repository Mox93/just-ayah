import { VFC } from "react";
import { Outlet } from "react-router-dom";

interface LeadsProps {}

const Leads: VFC<LeadsProps> = () => {
  return (
    <div className="Leads">
      <Outlet />
    </div>
  );
};

export default Leads;
