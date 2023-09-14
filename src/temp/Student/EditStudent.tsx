import { isEqual } from "lodash";
import { useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import { FormLayout } from "components/Layouts";
import { openModal, useRequestData } from "context";
import { useGlobalT, useLoading, usePageT } from "hooks";

import { StudentData, editStudentSchema, updateStudent } from "../api";
import StudentDataFields from "./StudentDataFields";

const { Form, useForm } = formAtoms<StudentData>();

export default function EditStudent() {
  const glb = useGlobalT();
  const pg = usePageT("student");

  const {
    params: { id },
    data,
  } = useRequestData<StudentData>();

  const [defaultData, setDefaultData] = useState(data);

  const [onSubmit, isLoading] = useLoading(
    async (stopLoading, data: StudentData) => {
      try {
        const parsedData = editStudentSchema.parse(data);
        await updateStudent(id!, parsedData);
        setDefaultData(data);
      } catch (error) {
        openModal(<ErrorMessage error={error} />, {
          center: true,
          closable: true,
        });
      } finally {
        stopLoading();
      }
    }
  );

  const formProps = useForm({
    defaultValues: data,
    onSubmit,
    resetToDefaultValues: true,
  });

  const {
    formHook: { control },
  } = formProps;

  const updatedData = useWatch({ control });
  const noChange = useMemo(
    () => isEqual(defaultData, updatedData),
    [defaultData, updatedData]
  );

  return (
    <FormLayout name="StudentEnroll" title={pg("formTitle")}>
      <Form
        submitProps={{ isLoading, children: glb("save"), disabled: noChange }}
        resetProps={{ children: glb("undo"), disabled: noChange }}
        {...formProps}
      >
        <StudentDataFields />
      </Form>
    </FormLayout>
  );
}
