import { FC } from "react";
import { SubmitHandler } from "react-hook-form";
import { Class } from "type-fest";

import Container from "components/Container";
import { AddDataFunc } from "models";

import { UserVariant } from "../NewUser.type";
import { useNewUserTabs } from "./NewUserTabs.utils";

interface NewUserTabsProps<TUser, TUserForm extends {}> {
  title: string;
  UserForm: FC<{ onSubmit: SubmitHandler<TUserForm> }>;
  addUser: AddDataFunc<TUser>;
  UserClass: Class<TUser>;
  variant: UserVariant;
}

export default function NewUserTabs<TUser, TUserForm extends {}>({
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
