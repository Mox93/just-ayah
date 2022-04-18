import { ErrorMessage as ErrorMessageComponent } from "@hookform/error-message";
import { FieldErrors, FieldPath } from "react-hook-form";
import { useMsgT } from "utils/translation";

interface ErrorMessageProps<
  TFieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TFieldName;
  errors?: FieldErrors<TFieldValues>;
}

const ErrorMessage = <TFieldValues,>({
  name,
  errors,
}: ErrorMessageProps<TFieldValues>) => {
  const msgT = useMsgT();

  return (
    <ErrorMessageComponent
      errors={errors}
      name={name as any}
      message={msgT("fieldRequired")}
      render={({ message, messages }) =>
        messages ? (
          Object.entries(messages).map(([type, message]) => (
            <p className="ErrorMessage" key={type}>
              {message}
            </p>
          ))
        ) : (
          <p className="ErrorMessage">{message}</p>
        )
      }
    />
  );
};

export const renderErrorMessage = <TFieldValues,>(
  props: ErrorMessageProps<TFieldValues>
) => {
  return <ErrorMessage<TFieldValues> {...props} />;
};

export default ErrorMessage;
