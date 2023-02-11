import { FC } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import Container from "components/Container";
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
      <img className="banner" src={justAyahBG} alt="just ayah" />
      <LanguageSelector />
      <Container variant="form" header={<h2 className="title">{title}</h2>}>
        {children}
      </Container>
    </main>
  );
};

export default FormLayout;
