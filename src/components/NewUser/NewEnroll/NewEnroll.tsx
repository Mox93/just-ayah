import { Class } from "type-fest";

import { ErrorToast, SuccessToast } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import { openToast } from "context";
import { useGlobalT, usePageT } from "hooks";
import { EnrollUser } from "hooks/Collection";
import { AddDataFunc, BaseModel } from "models";
import { createEnroll } from "models/blocks";
import { capitalize } from "utils";

import { UserVariant } from "../NewUser.type";
import { useEffect } from "react";

interface EnrollForm {
  name?: string;
  termsUrl?: string;
}

const { MiniForm, Input, useForm } = formAtoms<EnrollForm>();

interface NewEnrollProps {
  variant: UserVariant;
  addEnroll: AddDataFunc<BaseModel<EnrollUser>>;
  DBClass: Class<BaseModel<EnrollUser>>;
  termsUrl?: string;
  isLoading?: boolean;
}

export default function NewEnroll({
  DBClass,
  addEnroll,
  variant,
  termsUrl,
  isLoading,
}: NewEnrollProps) {
  const glb = useGlobalT();
  const pgT = usePageT("student");

  const formProps = useForm({
    onSubmit: (enroll, { reset }) =>
      addEnroll(new DBClass({ enroll: createEnroll(enroll) }), {
        applyLocally: true,
        onFulfilled: () => {
          openToast(
            <SuccessToast
              i18nKey={`new${capitalize(variant)}Enroll`}
              message={`a new ${variant} enroll was added!`}
            />
          );
          reset();
        },
        onRejected: (error: any) =>
          openToast(<ErrorToast error={error} />, {
            variant: "danger",
          }),
      }),
  });

  const {
    formHook: { setValue },
  } = formProps;

  useEffect(() => {
    setValue("termsUrl", termsUrl);
  }, [setValue, termsUrl]);

  return (
    <MiniForm
      className="NewEnroll"
      submitProps={{ children: glb("generateLink"), isLoading }}
      {...formProps}
    >
      <Input name="name" placeholder={pgT("newEnroll")} />
    </MiniForm>
  );
}
