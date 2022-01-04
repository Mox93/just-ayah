import { FunctionComponent } from "react";

import justAyahBG from "../assets/img/just-ayah-banner.jpg";
import LanguageSelector from "../components/LanguageSelector";
import StudentForm from "../components/StudentForm";

interface NewStudentProps {}

const NewStudent: FunctionComponent<NewStudentProps> = () => {
  return (
    <div className="new-student">
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />
      <StudentForm />
    </div>
  );
};

export default NewStudent;
