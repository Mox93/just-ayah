import { useMemo } from "react";

import { UpdateDataFunc } from "models";
import { Enroll } from "models/blocks";
import { shiftDate } from "models/_blocks";

export interface EnrollUser {
  enroll: Enroll;
}

export interface UseUpdateEnrollResult {
  refreshEnroll: (id: string, duration?: number) => void;
  updateEnrollName: (id: string, name: string) => void;
}

const useUpdateEnroll = (
  updateData: UpdateDataFunc<EnrollUser>
): UseUpdateEnrollResult => {
  return useMemo<UseUpdateEnrollResult>(
    () => ({
      refreshEnroll: (id: string, duration = 48) => {
        updateData(
          id,
          {
            "enroll.expiresAt": shiftDate(new Date(), { hour: duration }),
          },
          { applyLocally: true }
        );
      },
      updateEnrollName: (id: string, name: string) => {
        updateData(id, { "enroll.name": name }, { applyLocally: true });
      },
    }),
    [updateData]
  );
};

export default useUpdateEnroll;
