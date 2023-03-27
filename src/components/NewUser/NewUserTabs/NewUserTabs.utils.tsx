import { lazy, useMemo, FC } from "react";
import { SubmitHandler } from "react-hook-form";
import { Trans } from "react-i18next";
import { Class } from "type-fest";

import { usePopupContext } from "context";
import { Tabs, useGlobalT, useMessageT, useTabs } from "hooks";
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
  const msg = useMessageT("toast");

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
                    <Trans t={msg} i18nKey={`new${capitalize(variant)}`}>
                      <b>Success:</b> a new {variant} was added!
                    </Trans>,
                    { variant: "success" }
                  ),
                onRejected: (error: any) =>
                  openToast(
                    <>
                      <Trans t={msg} i18nKey="error">
                        <b>Error:</b> something went wrong!
                      </Trans>
                      <code>{error}</code>
                    </>,
                    { variant: "danger" }
                  ),
              })
            }
          />
        ),
      },
    ],
    [UserClass, UserForm, addUser, msg, openToast, variant]
  );

  return useTabs({ tabs, renderHeader: glb });
}
