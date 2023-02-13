import { useMemo, VFC } from "react";
import { SubmitHandler } from "react-hook-form";
import { Trans } from "react-i18next";
import { Class } from "type-fest";

import Container from "components/Container";
import { usePopupContext } from "context";
import { Tabs, useGlobalT, useMessageT, useTabs } from "hooks";
import { AddDataFunc } from "models";
import { capitalize } from "utils";

import EnrollsViewer from "../EnrollsViewer";
import { UserVariant } from "../NewUser.type";

interface NewUserTabsProps<TUser, TUserForm extends {}> {
  title: string;
  UserForm: VFC<{ onSubmit: SubmitHandler<TUserForm> }>;
  addUser: AddDataFunc<TUser>;
  UserClass: Class<TUser>;
  variant: UserVariant;
}

function NewUserTabs<TUser, TUserForm extends {}>({
  variant,
  title,
  UserForm,
  addUser,
  UserClass,
}: NewUserTabsProps<TUser, TUserForm>) {
  const glb = useGlobalT();
  const msg = useMessageT("toast");

  const { openToast } = usePopupContext();

  const onFulfilled = () =>
    openToast(
      <Trans t={msg} i18nKey={`new${capitalize(variant)}`}>
        <b>Success:</b> a new {variant} was added!
      </Trans>,
      { variant: "success" }
    );

  const onRejected = (error: any) =>
    openToast(
      <>
        <Trans t={msg} i18nKey="error">
          <b>Error:</b> something went wrong!
        </Trans>
        {`\n${error}`}
      </>,
      { variant: "danger" }
    );

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
              addUser(new UserClass(data), { onFulfilled, onRejected })
            }
          />
        ),
      },
    ],
    [UserClass, UserForm, addUser, variant]
  );

  const [tabsHeader, tabsBody] = useTabs({ tabs, renderHeader: glb });

  return (
    <Container
      variant="card"
      className="NewUserTabs"
      header={
        <>
          <h2 className="title">{title}</h2>
          {tabsHeader}
        </>
      }
    >
      {tabsBody}
    </Container>
  );
}

export default NewUserTabs;
