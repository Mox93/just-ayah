import { FC } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";
import { useHeader } from "hooks";
import { cn } from "utils";

interface FormLayoutProps {
  name?: string;
  title?: string;
}

const FormLayout: FC<FormLayoutProps> = ({ children, name, title }) => {
  useHeader({ title });

  return (
    <main className={cn("FormLayout", name)}>
      <img className="banner" src={justAyahBG} alt="" />
      <LanguageSelector />
      {children}
    </main>
  );
};

export default FormLayout;
