import { FunctionComponent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NewCustomer from "pages/Customers/NewCustomer";
import NewStudent from "pages/Students/NewStudent";

interface PublicViewProps {}

const PublicView: FunctionComponent<PublicViewProps> = () => {
  return (
    <Routes>
      <Route path="/sign-up" element={<NewCustomer />} />
      <Route path="/join" element={<NewStudent />} />
      <Route path="*" element={<Navigate replace to="/sign-up" />} />
    </Routes>
  );
};

export default PublicView;
