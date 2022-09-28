import { deleteField } from "firebase/firestore";
import { VFC, useEffect, useState, useCallback } from "react";
import { Trans } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";

import Container from "components/Container";
import FlashMessage from "components/FlashMessage";
import { FormLayout } from "components/Layouts";
import { usePopupContext, useStudentContext } from "context";
import { useMessageT, usePageT } from "hooks";
import { defaultMeta, StudentInfo } from "models/student";

import StudentForm from "../StudentForm";

const StudentEnroll: VFC = () => {
  const stu = usePageT("student");
  const msg = useMessageT("student");
  const { showPopup } = usePopupContext();
  const { id } = useParams();
  const { state } = useLocation();
  const [studentData, setStudentData] = useState<Partial<StudentInfo>>();

  const { updateStudent } = useStudentContext();
  const onSubmit = useCallback(
    (data: StudentInfo) => {
      updateStudent(
        id!,
        {
          ...data,
          meta: defaultMeta(),
          ...{ enroll: deleteField() },
        },
        {
          onFulfilled: () =>
            showPopup(
              <FlashMessage state="success">
                <Trans t={msg} i18nKey="enrollSuccess">
                  <h1>
                    <span className="accent">Thank You</span>
                    <span className="light">for Joining!</span>
                  </h1>
                  <p>We'll contact you soon</p>
                </Trans>
              </FlashMessage>,
              { center: true }
            ),
          onRejected: (reason) =>
            showPopup(
              <FlashMessage state="error">
                <Trans t={msg} i18nKey="enrollFail">
                  <h2 className="accent">Something Went Wrong!</h2>
                  <p>Please try again later.</p>
                </Trans>

                <div className="code">
                  <code>{JSON.stringify(reason, null, 2)}</code>
                </div>
              </FlashMessage>,
              { center: true }
            ),
        }
      );
    },
    [id]
  );

  useEffect(() => {
    const { data } = state as any;
    setStudentData(data);
  }, [id, state]);

  return (
    <FormLayout name="StudentEnroll" title={stu("formTitle")}>
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
    </FormLayout>
  );
};

export default StudentEnroll;
