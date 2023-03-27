import { useState } from "react";

import { Button } from "components/Buttons";
import Container from "components/Container";
import { useGlobalT } from "hooks";

interface TermsOfServicePopupProps {
  url: string;
  onAccept?: VoidFunction;
}

export default function TermsOfServicePopup({
  url,
  onAccept,
}: TermsOfServicePopupProps) {
  const glb = useGlobalT();

  const [isLoading, setIsLoading] = useState(true);

  return (
    <Container className="TermsOfServicePopup">
      <iframe
        title={glb("termsOfService")}
        src={url}
        allow="autoplay"
        onLoad={() => setIsLoading(false)}
      />
      <Button isLoading={isLoading} variant="success-solid" onClick={onAccept}>
        {glb("acceptTermsOfService")}
      </Button>
    </Container>
  );
}
