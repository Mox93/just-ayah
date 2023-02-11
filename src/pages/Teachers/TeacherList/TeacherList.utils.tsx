import { useMemo } from "react";

import { FieldProps } from "components/Table";
import { useGlobalT, usePersonalInfoT } from "hooks";
import Teacher from "models/teacher";
import { concat } from "utils";
import { findPhoneNumberByTags } from "models/blocks";
import { historyRep } from "models/_blocks";

export function UseTableFields() {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  return useMemo<FieldProps<Teacher>[]>(
    () => [
      {
        name: "name",
        header: pi("fullName"),
        className: "name",
        getValue: ({ data: { firstName, middleName, lastName } }) =>
          concat(firstName, middleName, lastName),
      },
      {
        name: "phoneNumber",
        header: pi("phoneNumber"),
        className: "phoneNumber",
        getValue: ({ data: { phoneNumber } }) =>
          findPhoneNumberByTags(phoneNumber, ["whatsapp"]),
        fit: true,
      },
      {
        name: "dateCreated",
        header: glb("dateCreated"),
        getValue: ({ meta: { dateCreated } }) => historyRep(dateCreated),
        fit: true,
      },
    ],
    []
  );
}
