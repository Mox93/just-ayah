import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";

interface CustomersProps {}

const Customers: FunctionComponent<CustomersProps> = () => {
  return (
    <div className="Customers">
      <Outlet />
    </div>
  );
};

export default Customers;
