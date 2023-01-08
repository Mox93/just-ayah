import { formAtoms } from "components/Form";
import { EnrollContext } from "context";
import { useGlobalT, usePageT, useSmartForm } from "hooks";
import { EnrollInfo } from "models/blocks";

const { MiniForm, Input } = formAtoms<EnrollInfo>();

interface NewEnrollProps<TUser> {
  enrollContext: EnrollContext<TUser>;
}

const NewEnroll = <TUser,>({ enrollContext }: NewEnrollProps<TUser>) => {
  const glb = useGlobalT();
  const stu = usePageT("student");

  const { addEnroll } = enrollContext;

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
