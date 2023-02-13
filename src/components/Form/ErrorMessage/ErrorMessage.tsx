import { ErrorMessage as ErrorMessageComponent } from "@hookform/error-message";
import { FieldErrors, Path } from "react-hook-form";

import { useDirT, useMessageT } from "hooks";

interface ErrorMessageProps<
  TFieldValues extends {},
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> {
  name: TFieldName;
  errors?: FieldErrors<TFieldValues>;
}

const ErrorMessage = <TFieldValues extends {}>({
  name,
  errors,
}: ErrorMessageProps<TFieldValues>) => {
  const dirT = useDirT();
  const msgT = useMessageT();

  return (
    <ErrorMessageComponent
      errors={errors}
      name={name as any}
      message="fieldRequired"
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
