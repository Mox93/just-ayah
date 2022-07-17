import { VFC } from "react";
import { Outlet } from "react-router-dom";

interface CustomersProps {}

const Customers: VFC<CustomersProps> = () => {
  return (
    <div className="Customers">
      <Outlet />
    </div>
  );
};

export default Customers;
