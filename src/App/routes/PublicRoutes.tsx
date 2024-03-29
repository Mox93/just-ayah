import { Navigate, Route, Routes } from "react-router-dom";
import NewLead from "pages/Leads/NewLead";
import { StudentEnroll } from "pages/Students";
import FormUI from "pages/UI/Form";
import MainUI from "pages/UI/Main";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/sign-up" element={<NewLead />} />
      <Route path="/join" element={<StudentEnroll />} />
      <Route path="/ui">
        <Route index element={<MainUI />} />
        <Route path="form" element={<FormUI />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/sign-up" />} />
    </Routes>
  );
}
