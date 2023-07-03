import { isEqual } from "lodash";
import { UseFormReset, useWatch } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { PartialDeep } from "type-fest";

import { ErrorMessage } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import FormLayout from "components/Layouts/FormLayout";
import { openModal, closeModal } from "context";
import { useApplyOnce, useLanguage, useLoading } from "hooks";
import { Location } from "models";
import { mergeCallbacks, pass } from "utils";

import SessionTrackFields from "./SessionTrackFields";
import SuccessMessage from "./SuccessMessage";
import {
  SessionTrackData,
  addSessionTrack,
  deleteSessionTrack,
  updateSessionTrack,
} from "./utils";
import { useMemo, useState } from "react";

const { Form, Textarea, useForm } = formAtoms<SessionTrackData>();

export default function SessionTrack() {
  const { id } = useParams();
  const { state } = useLocation() as Location<{
    data?: PartialDeep<SessionTrackData>;
  }>;

  const [defaultData, setDefaultData] = useState(state?.data);

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
    <FormLayout title="(الاشراف الإداري) تقارير اللقاءات">
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
    </FormLayout>
  );
}
