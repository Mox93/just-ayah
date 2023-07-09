import { FC } from "react";
import { Class } from "type-fest";

import Container from "components/Container";
import { SubmitHandler } from "components/Form";
import { AddDataFunc } from "models";

import { UserVariant } from "../NewUser.type";
import { useNewUserTabs } from "./NewUserTabs.utils";

interface NewUserTabsProps<TUser, TUserForm> {
  title: string;
  UserForm: TUserForm;
  addUser: AddDataFunc<TUser>;
  UserClass: Class<TUser>;
  variant: UserVariant;
}

export default function NewUserTabs<
  TUser,
  TUserForm extends FC<{ onSubmit: SubmitHandler<any> }>
>({
  variant,
  title,
  UserForm,
  addUser,
  UserClass,
}: NewUserTabsProps<TUser, TUserForm>) {
  const [tabsHeader, tabsBody] = useNewUserTabs({
    variant,
    UserForm,
    addUser,
    UserClass,
  });

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
