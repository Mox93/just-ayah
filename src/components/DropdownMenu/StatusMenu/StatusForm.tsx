import { ReactElement } from "react";

import { formAtoms } from "components/Form";
import { useSmartForm } from "hooks";

const { MiniForm } = formAtoms();

interface StatusFormProps {
  children: ReactElement;
  onSubmit: (data: Record<string, any>) => void;
  defaultValues: Record<string, any>;
}

export default function StatusForm({
  onSubmit,
  defaultValues,
  children,
}: StatusFormProps) {
  const formProps = useSmartForm({
    onSubmit,
    defaultValues,
  });

  return (
    <MiniForm noErrorMessage {...formProps} submitProps={{ iconButton: true }}>
      {children}
    </MiniForm>
  );
}
