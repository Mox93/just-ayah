import { VFC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NewCustomer from "pages/Customers/NewCustomer";
import { StudentEnroll } from "pages/Students";
import FormUI from "pages/UI/Form";
import MainUI from "pages/UI/Main";

interface PublicViewProps {}

const PublicView: VFC<PublicViewProps> = () => {
  return (
    <Routes>
      <Route path="/sign-up" element={<NewCustomer />} />
      <Route path="/join" element={<StudentEnroll />} />
      <Route path="/ui">
        <Route index element={<MainUI />} />
        <Route path="form" element={<FormUI />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/sign-up" />} />
    </Routes>
  );
};

export default PublicView;
