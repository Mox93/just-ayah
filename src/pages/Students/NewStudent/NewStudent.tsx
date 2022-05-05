import { FunctionComponent } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";
import StudentForm from "../StudentForm";
import { usePopup } from "context/Popup";

interface NewStudentProps {}

const NewStudent: FunctionComponent<NewStudentProps> = () => {
  const { showPopup } = usePopup();

  return (
    <div className="NewStudent">
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />
      <StudentForm
        onFulfilled={() =>
          showPopup(
            <>
              <h1>Thank you for joining</h1>
              <a href="/">go back to the home page</a>
              <a href="/join">fill in a new form</a>
            </>,
            false
          )
        }
      />
    </div>
  );
};

export default NewStudent;
