import { deleteField } from "firebase/firestore";
import { VFC, useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";

import Container from "components/Container";
import { EnrolledMessage, ErrorMessage } from "components/FlashMessages";
import { FormLayout } from "components/Layouts";
import { usePopupContext, useTeacherContext } from "context";
import { usePageT } from "hooks";
import { defaultMeta, TeacherInfo } from "models/teacher";

import TeacherForm from "../TeacherForm";

interface TeacherEnrollProps {}

const TeacherEnroll: VFC<TeacherEnrollProps> = () => {
  const tch = usePageT("teacher");
  const { openModal } = usePopupContext();
  const { id } = useParams();
  const { state } = useLocation();
  const [teacherData, setTeacherData] = useState<Partial<TeacherInfo>>();

  const { updateTeacher } = useTeacherContext();
  const onSubmit = useCallback(
    (data: TeacherInfo) => {
      updateTeacher(
        id!,
        {
          ...data,
          meta: defaultMeta(),
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

  useEffect(() => {
    const { data } = state as any;
    setTeacherData(data);
  }, [id, state]);

  return (
    <FormLayout name="TeacherEnroll" title={tch("formTitle")}>
      <Container
        variant="form"
        header={<h2 className="title">{tch("formTitle")}</h2>}
      >
        <TeacherForm
          onSubmit={onSubmit}
          formId={id}
          defaultValues={teacherData}
        />
      </Container>
    </FormLayout>
  );
};

export default TeacherEnroll;
