import { useEffect, VFC } from "react";

import { LoadingSpinner } from "components/Icons";
import { usePopupContext } from "context";
import Container from "components/Container";

interface LoadingPopupProps {
  message?: string;
}

const LoadingPopup: VFC<LoadingPopupProps> = ({ message }) => {
  const { showPopup, closePopup } = usePopupContext();

  useEffect(() => {
    showPopup(
      <Container variant="card" className="LoadingPopup">
        {message}
        <LoadingSpinner />
      </Container>,
      { center: true }
    );

    return closePopup;
  }, []);

  return null;
};

export default LoadingPopup;
