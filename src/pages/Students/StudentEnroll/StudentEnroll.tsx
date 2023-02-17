import { useLocation, useParams } from "react-router-dom";
import { PartialDeep } from "type-fest";

import { EnrolledMessage, ErrorMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { usePopupContext, useStudentEnrollContext } from "context";
import { usePageT } from "hooks";
import { Location } from "models";
import Student, { StudentFormData } from "models/student";

import StudentForm from "../StudentForm";

export default function StudentEnroll() {
  const stu = usePageT("student");

  const { openModal } = usePopupContext();
  const { submitEnroll } = useStudentEnrollContext();

  const { id } = useParams();
  const {
    state: { data },
  } = useLocation() as Location<{ data: PartialDeep<StudentFormData> }>;

  return (
    <FormLayout name="StudentEnroll" title={stu("formTitle")}>
      <StudentForm
        onSubmit={(data: StudentFormData) =>
          submitEnroll(id!, new Student.DB(data), {
            onFulfilled: () => openModal(<EnrolledMessage />, { center: true }),
            onRejected: (reason) =>
              openModal(<ErrorMessage error={reason} />, {
                center: true,
                closable: true,
              }),
          })
        }
        formId={id}
        defaultValues={data}
        termsUrl="https://drive.google.com/file/d/1uXAUeNnZAVRCSq8u7Xv1lZXBX-fmLR-k/preview"
      />
    </FormLayout>
  );
}
