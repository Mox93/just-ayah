import { useLocation, useParams } from "react-router-dom";
import { PartialDeep } from "type-fest";

import { EnrolledMessage, ErrorMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { usePopupContext, useTeacherEnrollContext } from "context";
import { usePageT } from "hooks";
import { Location } from "models";
import Teacher, { TeacherFormData } from "models/teacher";

import TeacherForm from "../TeacherForm";

export default function TeacherEnroll() {
  const tch = usePageT("teacher");

  const { openModal } = usePopupContext();
  const { submitEnroll } = useTeacherEnrollContext();

  const { id } = useParams();
  const {
    state: { data },
  } = useLocation() as Location<{ data: PartialDeep<TeacherFormData> }>;

  return (
    <FormLayout name="TeacherEnroll" title={tch("formTitle")}>
      <TeacherForm
        onSubmit={(data: TeacherFormData) =>
          submitEnroll(id!, new Teacher.DB(data), {
            onFulfilled: () => openModal(<EnrolledMessage />, { center: true }),
            onRejected: (error) =>
              openModal(<ErrorMessage error={error} />, {
                center: true,
                closable: true,
              }),
          })
        }
        formId={id}
        defaultValues={data}
      />
    </FormLayout>
  );
}
