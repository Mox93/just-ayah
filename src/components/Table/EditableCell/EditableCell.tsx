import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { formAtoms } from "components/Form";

const { MiniForm, Input, useForm } = formAtoms<{ value: string }>();

interface EditableCellProps {
  value?: string;
  onSubmit?: (value: string) => void;
  onCancel?: VoidFunction;
}

export default function EditableCell({
  value,
  onSubmit,
  onCancel,
}: EditableCellProps) {
  const formProps = useForm({
    onSubmit: ({ value }) => onSubmit?.(value),
    defaultValues: { value },
  });

  return (
    <MiniForm
      className="EditableCell"
      {...formProps}
      submitProps={{ iconButton: true, variant: "success-ghost" }}
      resetProps={{
        onClick: onCancel,
        children: <CrossIcon className="icon" />,
        iconButton: true,
        variant: "danger-ghost",
      }}
    >
      <Input name="value" />
    </MiniForm>
  );
}
