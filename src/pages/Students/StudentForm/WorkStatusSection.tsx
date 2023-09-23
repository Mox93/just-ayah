import { Control, useWatch } from "react-hook-form";
import { PartialDeep } from "type-fest";

import {
  InputGroup,
  SelectionInput as BaseSelectionInput,
  formAtoms,
} from "components/Form";
import { useGlobalT, usePersonalInfoT } from "hooks";
import { OTHER } from "models";
import {
  WorkStatus,
  booleanSchema,
  booleanSelectorProps,
  noWorkReasons,
} from "models/blocks";
import { oneOf } from "utils";
import { transformer } from "utils/transformer";

interface HasWorkStatus {
  workStatus?: PartialDeep<WorkStatus>;
}

const {
  Input,
  modifiers: { defaultModifiers },
  useFormContext,
} = formAtoms<HasWorkStatus>();

const SelectionInput = transformer(BaseSelectionInput, ...defaultModifiers);

export default function WorkStatusSection() {
  const pi = usePersonalInfoT();
  const glb = useGlobalT();

  const workStatus = useWorkStatus();
  const yesNoProps = booleanSelectorProps(glb, "yes", "no");

  return (
    <>
      <InputGroup>
        <SelectionInput
          name="workStatus.doesWork"
          label={pi("doesWork")}
          rules={{ required: "noWorkStatus" }}
          {...yesNoProps}
        />

        {workStatus?.doesWork ? (
          <Input
            name="workStatus.job"
            label={pi("occupation")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        ) : workStatus?.doesWork === false ? (
          <SelectionInput
            name="workStatus.status.value"
            type="radio"
            options={noWorkReasons}
            renderElement={pi}
            label={pi("noWorkReason")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        ) : null}
      </InputGroup>

      {workStatus?.doesWork === false &&
        workStatus?.status?.value === OTHER && (
          <Input
            name="workStatus.status.other"
            label={pi("noWorkDetails")}
            rules={{ required: "noWorkStatus", shouldUnregister: true }}
          />
        )}
    </>
  );
}

export function useWorkStatus() {
  const {
    formHook: { control },
  } = useFormContext();

  const workStatus = useWatch({
    control: control as unknown as Control<HasWorkStatus>,
    name: "workStatus",
  });

  const { doesWork } = workStatus || {};

  return (
    workStatus &&
    ({
      ...workStatus,
      ...(!oneOf(doesWork, [undefined, null])
        ? { doesWork: booleanSchema.parse(doesWork) }
        : {}),
    } as typeof workStatus)
  );
}
