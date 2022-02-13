import { FunctionComponent, useState } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";
import StudentForm from "../StudentForm";
import StudentJoined from "../StudentJoined";

import "./style.scss";

interface NewStudentProps {}

const NewStudent: FunctionComponent<NewStudentProps> = () => {
  const [complete, setComplete] = useState(false);

  return (
    <div className="NewStudent">
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />
      <StudentForm
        onfulfilled={() => setComplete(true)}
        onrejected={() => setComplete(false)}
      />
      {<StudentJoined visible={complete} />}
    </div>
  );
};

export default NewStudent;
