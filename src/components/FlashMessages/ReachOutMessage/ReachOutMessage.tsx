import { VFC } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { useMessageT } from "hooks";

import FlashCard from "../FlashCard";

interface ReachOutMessageProps {}

const ReachOutMessage: VFC<ReachOutMessageProps> = () => {
  const msg = useMessageT("flash");
  return (
    <FlashCard state="success">
      <Trans t={msg} i18nKey="joined">
        <h1>
          <span className="accent">Thank You</span>
          <span className="light">Thank you for reaching out!</span>
        </h1>
        <p>We'll contact you soon.</p>
        <Link to="/">go back to the home page</Link>
      </Trans>
    </FlashCard>
  );
};

export default ReachOutMessage;
