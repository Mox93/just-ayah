import { deleteField } from "firebase/firestore";
import { VFC, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";

import Container from "components/Container";
import { EnrolledMessage, ErrorMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { usePopupContext, useStudentContext } from "context";
import { usePageT } from "hooks";
import { studentFromInfo, StudentInfo } from "models/student";

import StudentForm from "../StudentForm";

const StudentEnroll: VFC = () => {
  const stu = usePageT("student");
  const { openModal } = usePopupContext();
  const { id } = useParams();
  const { state } = useLocation();

  const { updateStudent } = useStudentContext();
  const onSubmit = useCallback(
    (data: StudentInfo) => {
      updateStudent(
        id!,
        {
          ...studentFromInfo(data),
          ...{ enroll: deleteField() },
        },
        {
          onFulfilled: () => openModal(<EnrolledMessage />, { center: true }),
          onRejected: (reason) =>
            openModal(<ErrorMessage error={reason} />, {
              center: true,
              closable: true,
            }),
        }
      );
    },
    [id]
  );

  const { data } = state as any;

  return (
    <FormLayout name="StudentEnroll" title={stu("formTitle")}>
      <Container
        variant="form"
        header={<h2 className="title">{stu("formTitle")}</h2>}
      >
        <StudentForm onSubmit={onSubmit} formId={id} defaultValues={data} />
      </Container>
    </FormLayout>
  );
};

export default StudentEnroll;
