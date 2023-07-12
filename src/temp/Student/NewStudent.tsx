import { EnrolledMessage, ErrorMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { openModal, startLoading, stopLoading } from "context";
import { usePageT } from "hooks";

import { addStudent, newStudentSchema } from "../api";
import StudentForm from "./StudentForm";

export default function NewStudent() {
  const pg = usePageT("student");

  return (
    <FormLayout name="StudentEnroll" title={pg("formTitle")}>
      <StudentForm
        onSubmit={async (data, { reset }) => {
          startLoading(pg("submitting"));

          try {
            const parsedData = newStudentSchema.parse(data);
            await addStudent(parsedData);
            openModal(<EnrolledMessage />, { center: true });
            reset();
          } catch (error) {
            openModal(<ErrorMessage error={error} />, {
              center: true,
              closable: true,
            });
          } finally {
            stopLoading();
          }
        }}
        termsUrl="https://drive.google.com/file/d/1bzNhKaBs1f7yICtY9yX0udNw-KWaukb4/preview"
      />
    </FormLayout>
  );
}
