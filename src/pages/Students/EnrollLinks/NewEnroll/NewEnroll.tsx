import { VFC } from "react";

import { formAtoms } from "components/Form";
import { useStudentEnrollContext } from "context";
import { useGlobalT, usePageT, useSmartForm } from "hooks";
import { EnrollInfo } from "models/studentEnroll";

const { MiniForm, Input } = formAtoms<EnrollInfo>();

interface NewEnrollProps {}

const NewEnroll: VFC<NewEnrollProps> = () => {
  const glb = useGlobalT();
  const stu = usePageT("students");

  const { addEnroll } = useStudentEnrollContext();

  const formProps = useSmartForm<EnrollInfo>({
    onSubmit: (data) => addEnroll(data),
    resetOnSubmit: true,
  });

  return (
    <MiniForm
      className="NewEnroll"
      submitProps={{ children: glb("generateLink") }}
      {...formProps}
    >
      <Input name="key" placeholder={stu("newEnroll")} />
    </MiniForm>
  );
};

export default NewEnroll;
