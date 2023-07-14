import { lazy, useMemo, FC } from "react";
import { Class } from "type-fest";

import { ErrorToast, SuccessToast } from "components/FlashMessages";
import { SubmitHandler } from "components/Form";
import { openToast } from "context";
import { Tabs, useGlobalT, useTabs } from "hooks";
import { AddDataFunc } from "models";
import { capitalize } from "utils";

import { UserVariant } from "../NewUser.type";

const EnrollsViewer = lazy(() => import("../EnrollsViewer"));

interface UseNewUserTabsProps<TUser, TUserForm extends {}> {
  UserForm: FC<{ onSubmit: SubmitHandler<TUserForm> }>;
  addUser: AddDataFunc<TUser>;
  UserClass: Class<TUser>;
  variant: UserVariant;
}

export function useNewUserTabs<TUser, TUserForm extends {}>({
  variant,
  UserForm,
  addUser,
  UserClass,
}: UseNewUserTabsProps<TUser, TUserForm>) {
  const glb = useGlobalT();

  const tabs = useMemo<Tabs>(
    () => [
      {
        key: "links",
        body: <EnrollsViewer variant={variant} />,
      },
      {
        key: "form",
        body: (
          <UserForm
            onSubmit={(data, { reset }) =>
              addUser(new UserClass(data), {
                onFulfilled: () => {
                  openToast(
                    <SuccessToast
                      i18nKey={`new${capitalize(variant)}`}
                      message={`a new ${variant} was added!`}
                    />,
                    { variant: "success" }
                  );
                  reset();
                },
                onRejected: (error: any) =>
                  openToast(<ErrorToast error={error} />, {
                    variant: "danger",
                  }),
              })
            }
          />
        ),
      },
    ],
    [UserClass, UserForm, addUser, variant]
  );

  return useTabs({ tabs, renderHeader: glb });
}
