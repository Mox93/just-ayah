import { FetchData } from "models";
import { EnrollInfo, UserEnroll } from "models/enroll";
import { omit } from "utils";

export interface EnrollContext<TUser> {
  enrolls: UserEnroll<TUser>[];
  addEnroll: (enroll?: EnrollInfo) => void;
  fetchEnrolls: FetchData;
  refreshEnroll: (id: string, duration?: number) => void;
  updateEnrollKey: (id: string, key: string) => void;
  deleteEnroll: (id: string) => void;
}

export const initialState: EnrollContext<any> = {
  enrolls: [],
  addEnroll: omit,
  fetchEnrolls: omit,
  refreshEnroll: omit,
  updateEnrollKey: omit,
  deleteEnroll: omit,
};
