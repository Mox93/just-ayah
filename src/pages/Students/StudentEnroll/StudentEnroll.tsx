import { useLocation, useParams } from "react-router-dom";
import { PartialDeep } from "type-fest";

import { EnrolledMessage, ErrorMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { openModal, useStudentEnrollContext } from "context";
import { usePageT } from "hooks";
import { Location } from "models";
import Student, { StudentEnrollFormData } from "models/student";

import StudentForm from "../StudentForm";

export default function StudentEnroll() {
  const pgT = usePageT("student");

  const { submitEnroll } = useStudentEnrollContext();

  const { id } = useParams();
  const {
    state: { data },
  } = useLocation() as Location<{ data: PartialDeep<StudentEnrollFormData> }>;

  return (
    <FormLayout name="StudentEnroll" title={pgT("formTitle")}>
      <StudentForm
        onSubmit={(data, { reset }) =>
          submitEnroll(id!, new Student.DB(data), {
            onFulfilled: () => {
              openModal(<EnrolledMessage />, { center: true });
              reset();
            },
            onRejected: (error) =>
              openModal(<ErrorMessage error={error} />, {
                center: true,
                closable: true,
              }),
          })
        }
        formId={id}
        defaultValues={data}
        termsUrl={data.enroll?.termsUrl}
      />
    </FormLayout>
  );
}
