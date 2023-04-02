import { lazy, useMemo, FC } from "react";
import { SubmitHandler } from "react-hook-form";
import { Class } from "type-fest";

import { ErrorToast, SuccessToast } from "components/FlashMessages";
import { usePopupContext } from "context";
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

  const { openToast } = usePopupContext();

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
            onSubmit={(data) =>
              addUser(new UserClass(data), {
                onFulfilled: () =>
                  openToast(
                    <SuccessToast
                      i18nKey={`new${capitalize(variant)}`}
                      message={`a new ${variant} was added!`}
                    />,
                    { variant: "success" }
                  ),
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
    [UserClass, UserForm, addUser, openToast, variant]
  );

  return useTabs({ tabs, renderHeader: glb });
}
