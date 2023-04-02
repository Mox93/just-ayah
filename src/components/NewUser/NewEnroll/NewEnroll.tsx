import { Class } from "type-fest";

import { ErrorToast, SuccessToast } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import { usePopupContext } from "context";
import { useGlobalT, usePageT, useSmartForm } from "hooks";
import { EnrollUser } from "hooks/Collection";
import { AddDataFunc, BaseModel } from "models";
import { createEnroll } from "models/blocks";
import { capitalize } from "utils";

import { UserVariant } from "../NewUser.type";

interface EnrollForm {
  name?: string;
}

const { MiniForm, Input } = formAtoms<EnrollForm>();

interface NewEnrollProps {
  variant: UserVariant;
  addEnroll: AddDataFunc<BaseModel<EnrollUser>>;
  DBClass: Class<BaseModel<EnrollUser>>;
}

export default function NewEnroll({
  DBClass,
  addEnroll,
  variant,
}: NewEnrollProps) {
  const glb = useGlobalT();
  const pgT = usePageT("student");

  const { openToast } = usePopupContext();

  const formProps = useSmartForm<EnrollForm>({
    onSubmit: (enroll) =>
      addEnroll(new DBClass({ enroll: createEnroll(enroll) }), {
        applyLocally: true,
        onFulfilled: () =>
          openToast(
            <SuccessToast
              i18nKey={`new${capitalize(variant)}Enroll`}
              message={`a new ${variant} enroll was added!`}
            />,
            { variant: "success" }
          ),
        onRejected: (error: any) =>
          openToast(<ErrorToast error={error} />, {
            variant: "danger",
          }),
      }),
    resetOnSubmit: true,
  });

  return (
    <MiniForm
      className="NewEnroll"
      submitProps={{ children: glb("generateLink") }}
      {...formProps}
    >
      <Input name="name" placeholder={pgT("newEnroll")} />
    </MiniForm>
  );
}
