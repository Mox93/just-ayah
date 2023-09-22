import { useMemo, useState } from "react";
import { isEqual } from "lodash";
import { UseFormReset, useWatch } from "react-hook-form";
import { PartialDeep } from "type-fest";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { openModal, closeModal, useRequestData } from "context";
import { useApplyOnce, useLanguage, useLoading } from "hooks";
import { mergeCallbacks, pass } from "utils";

import {
  SessionTrackData,
  addSessionTrack,
  deleteSessionTrack,
  updateSessionTrack,
} from "../api";
import SessionTrackFields from "./SessionTrackFields";
import SuccessMessage from "../SuccessMessage";
import DeleteButton from "./DeleteButton";

const { Form, Textarea, useForm } = formAtoms<SessionTrackData>();

export default function SessionTrack() {
  const {
    data,
    params: { id },
  } = useRequestData<PartialDeep<SessionTrackData>>();

  const [defaultData, setDefaultData] = useState(data);

  const [, setLanguage] = useLanguage();

  useApplyOnce(() => {
    setLanguage("ar");
  });

  const [addTrack, isLoading] = useLoading(
    (
      stopLoading,
      data: SessionTrackData,
      reset: UseFormReset<SessionTrackData>
    ) =>
      (id
        ? updateSessionTrack(id, data).then(() => setDefaultData(data))
        : addSessionTrack(data).then((doc) => {
            openModal(
              <SuccessMessage
                startOver={mergeCallbacks(
                  closeModal,
                  pass(reset, { date: new Date() })
                )}
                undo={async () => {
                  await deleteSessionTrack({ id: doc.id });
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
    onSubmit: (data, { reset }) => addTrack(data, reset),
    defaultValues: id ? defaultData : { date: new Date() },
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

  return (
    <FormLayout title="تقارير اللقاءات (الاشراف الإداري)">
      <Form
        {...formProps}
        resetProps={{
          ...(id && {
            children: "تراجع",
            disabled: noChange,
          }),
        }}
        submitProps={{
          isLoading,
          ...(id && {
            children: "حفظ",
            disabled: noChange,
          }),
        }}
      >
        <SessionTrackFields />
        <Textarea name="notes" label="ملاحظات" />
      </Form>
      {id && (
        <DeleteButton
          onDelete={async () => {
            await deleteSessionTrack({ id });
            closeModal();
          }}
        />
      )}
    </FormLayout>
  );
}
