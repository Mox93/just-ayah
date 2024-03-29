import { ReactNode } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import Container from "components/Container";
import LanguageSelector from "components/LanguageSelector";
import { useSetHeaderProps } from "context";
import { cn } from "utils";

interface FormLayoutProps {
  children: ReactNode;
  name?: string;
  title?: string;
}

export default function FormLayout({ children, name, title }: FormLayoutProps) {
  useSetHeaderProps({ title });

  return (
    <main className={cn("FormLayout", name)}>
      <img className="banner" src={justAyahBG} alt="just ayah" />
      <LanguageSelector dir="rtl" anchorPoint="top-start" />
      <Container variant="form" header={<h2 className="title">{title}</h2>}>
        {children}
      </Container>
    </main>
  );
}
