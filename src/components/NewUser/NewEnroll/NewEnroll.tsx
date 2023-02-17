import { Class } from "type-fest";

import { formAtoms } from "components/Form";
import { useGlobalT, usePageT, useSmartForm } from "hooks";
import { EnrollUser } from "hooks/Collection";
import { AddDataFunc, BaseModel } from "models";
import { createEnroll } from "models/blocks";

interface EnrollForm {
  name?: string;
}

const { MiniForm, Input } = formAtoms<EnrollForm>();

interface NewEnrollProps {
  addEnroll: AddDataFunc<BaseModel<EnrollUser>>;
  DBClass: Class<BaseModel<EnrollUser>>;
}

export default function NewEnroll({ DBClass, addEnroll }: NewEnrollProps) {
  const glb = useGlobalT();
  const stu = usePageT("student");

  const formProps = useSmartForm<EnrollForm>({
    onSubmit: (enroll) =>
      addEnroll(new DBClass({ enroll: createEnroll(enroll) }), {
        applyLocally: true,
      }),
    resetOnSubmit: true,
  });

  return (
    <MiniForm
      className="NewEnroll"
      submitProps={{ children: glb("generateLink") }}
      {...formProps}
    >
      <Input name="name" placeholder={stu("newEnroll")} />
    </MiniForm>
  );
}
