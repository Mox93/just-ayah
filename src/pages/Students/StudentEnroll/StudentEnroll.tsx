import { deleteField } from "firebase/firestore";
import { VFC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import Container from "components/Container";
import LanguageSelector from "components/LanguageSelector";
import { usePopupContext, useStudentContext } from "context";
import { usePageT } from "hooks";
import { defaultMeta, StudentInfo } from "models/student";

import StudentForm from "../StudentForm";

const StudentEnroll: VFC = () => {
  const stu = usePageT("students");
  const { showPopup } = usePopupContext();
  const { id } = useParams();
  const { state } = useLocation();
  const [studentData, setStudentData] = useState<Partial<StudentInfo>>();

  const { updateStudent } = useStudentContext();
  const onSubmit = (data: StudentInfo) => {
    updateStudent(
      id!,
      {
        ...data,
        ...{
          openedAt: deleteField(),
          awaitEnroll: deleteField(),
          meta: defaultMeta(),
        },
      },
      {
        onFulfilled: () =>
          showPopup(
            <>
              <h1>Thank you for joining</h1>
              <a href="/">go back to the home page</a>
              <a href="/join">fill in a new form</a>
            </>
          ),
      }
    );
  };

  useEffect(() => {
    const { data } = state as any;
    setStudentData(data);
  }, [id, state]);

  return (
    <div className="StudentEnroll">
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />

      <Container
        variant="form"
        header={<h2 className="title">{stu("formTitle")}</h2>}
      >
        <StudentForm
          onSubmit={onSubmit}
          formId={id}
          defaultValues={studentData}
        />
      </Container>
    </div>
  );
};

export default StudentEnroll;
