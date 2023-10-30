import { DocumentData, DocumentReference } from "firebase/firestore";
import { isEqual } from "lodash";
import { useMemo, useState } from "react";
import { DeepPartial, UseFormReset, useWatch } from "react-hook-form";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import { closeModal, openModal, useRequestData } from "context";
import { useApplyOnce, useLanguage, useLoading } from "hooks";
import { SessionTrackData } from "temp/api";
import SuccessMessage from "temp/SuccessMessage";
import { mergeCallbacks, pass } from "utils";
import { HttpsCallable } from "firebase/functions";

interface UseSessionFormOptions<TSession extends SessionTrackData> {
  addSession: (data: TSession) => Promise<DocumentReference<DocumentData>>;
  updateSession: (id: string, data: TSession) => Promise<void>;
  deleteSession: HttpsCallable<{ id: string }, unknown>;
}

export function useSessionForm<TSession extends SessionTrackData>({
  addSession,
  updateSession,
  deleteSession,
}: UseSessionFormOptions<TSession>) {
  const { useForm } = useMemo(() => formAtoms<TSession>(), []);

  const [, setLanguage] = useLanguage();

  useApplyOnce(() => {
    setLanguage("ar");
  });

  const {
    data,
    params: { id },
  } = useRequestData<DeepPartial<TSession>>();

  const [defaultData, setDefaultData] = useState(data);

  const [submitForm, isLoading] = useLoading(
    (stopLoading, data: TSession, reset: UseFormReset<TSession>) =>
      (id
        ? updateSession(id, data).then(() =>
            setDefaultData(data as DeepPartial<TSession>)
          )
        : addSession(data).then((doc) => {
            openModal(
              <SuccessMessage
                startOver={mergeCallbacks(
                  closeModal,
                  pass(reset, { date: new Date() } as TSession)
                )}
                undo={async () => {
                  await deleteSession({ id: doc.id });
                  closeModal();
                }}
              />,
              { center: true }
            );
          })
      )
        .catch((error) =>
          openModal(<ErrorMessage error={error} />, {
            center: true,
            closable: true,
          })
        )
        .finally(stopLoading)
  );

  const formProps = useForm({
    onSubmit: (data, { reset }) => submitForm(data, reset),
    defaultValues: (id
      ? defaultData
      : { date: new Date() }) as DeepPartial<TSession>,
    resetToDefaultValues: true,
  });

  const {
    formHook: { control },
  } = formProps;

  const updatedData = useWatch({ control });
  const noChange = useMemo(
    () => isEqual(defaultData, updatedData),
    [defaultData, updatedData]
  );

  return { id, formProps, isLoading, noChange };
}
