import { ErrorMessage as ErrorMessageComponent } from "@hookform/error-message";
import { FieldErrors, FieldPath } from "react-hook-form";

import { useDirT, useMsgT } from "utils/translation";

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
  const dirT = useDirT();
  const msgT = useMsgT();

  return (
    <ErrorMessageComponent
      errors={errors}
      name={name as any}
      message={msgT("fieldRequired")}
      render={({ message, messages }) =>
        messages ? (
          Object.entries(messages).map(
            ([type, message]) =>
              typeof message === "string" && (
                <p className="ErrorMessage" key={type} dir={dirT}>
                  {msgT(message!)}
                </p>
              )
          )
        ) : (
          <p className="ErrorMessage" dir={dirT}>
            {msgT(message)}
          </p>
        )
      }
    />
  );
};

export default ErrorMessage;