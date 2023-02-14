import { VFC } from "react";

import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { formAtoms } from "components/Form";
import { useSmartForm } from "hooks";

const { MiniForm, Input } = formAtoms<{ value: string }>();

interface EditableCellProps {
  value?: string;
  onSubmit?: (value: string) => void;
  onCancel?: VoidFunction;
}

const EditableCell: VFC<EditableCellProps> = ({
  value,
  onSubmit,
  onCancel,
}) => {
  const formProps = useSmartForm<{ value: string }>({
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
};

export default EditableCell;