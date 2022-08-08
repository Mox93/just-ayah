import { FC } from "react";

import { formAtoms } from "components/Form";
import { useSmartForm } from "hooks";

const { MiniForm } = formAtoms();

interface StatusFormProps {
  onSubmit: (data: Record<string, any>) => void;
  defaultValues: Record<string, any>;
}

const StatusForm: FC<StatusFormProps> = ({
  onSubmit,
  defaultValues,
  children,
}) => {
  const formProps = useSmartForm({
    onSubmit,
    config: { defaultValues },
  });

  return (
    <MiniForm noErrorMessage {...formProps} submitProps={{ iconButton: true }}>
      {children}
    </MiniForm>
  );
};

export default StatusForm;
