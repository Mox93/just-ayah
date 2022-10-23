import { useEffect, VFC } from "react";

import { LoadingSpinner } from "components/Icons";
import { usePopupContext } from "context";
import Container from "components/Container";

interface LoadingPopupProps {
  message?: string;
}

const LoadingPopup: VFC<LoadingPopupProps> = ({ message }) => {
  const { openModal, closeModal } = usePopupContext();

  useEffect(() => {
    openModal(
      <Container variant="card" className="LoadingPopup">
        {message}
        <LoadingSpinner />
      </Container>,
      { center: true }
    );

    return closeModal;
  }, []);

  return null;
};

export default LoadingPopup;
