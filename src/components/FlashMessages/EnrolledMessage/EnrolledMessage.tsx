import { VFC } from "react";
import { Trans } from "react-i18next";

import { useMessageT } from "hooks";

import FlashCard from "../FlashCard";

interface EnrolledMessageProps {}

const EnrolledMessage: VFC<EnrolledMessageProps> = () => {
  const msg = useMessageT("flash");
  return (
    <FlashCard state="success">
      <Trans t={msg} i18nKey="joined">
        <h1>
          <span className="accent">Thank You</span>
          <span className="light">for Joining!</span>
        </h1>
        <p>We'll contact you soon.</p>
      </Trans>
    </FlashCard>
  );
};

export default EnrolledMessage;
