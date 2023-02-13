import { Control, useWatch } from "react-hook-form";
import { PartialDeep } from "type-fest";

import { booleanSchema, WorkStatus } from "models/blocks";
import { oneOf } from "utils";

interface HasWorkStatus {
  workStatus: WorkStatus;
}

export function useWorkStatus<T extends PartialDeep<HasWorkStatus>>(
  control: Control<T>
) {
  const workStatus = useWatch({
    control: control as unknown as Control<PartialDeep<HasWorkStatus>>,
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
