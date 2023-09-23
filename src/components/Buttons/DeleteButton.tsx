import { useNavigate } from "react-router-dom";

import { ReactComponent as DeleteIcon } from "assets/icons/delete-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { FlashCard } from "components/FlashMessages";
import { openModal } from "context";
import { useLoading } from "hooks";

interface DeleteButtonProps {
  onDelete: VoidFunction;
  label: string;
  message?: string;
}

export default function DeleteButton(props: DeleteButtonProps) {
  return (
    <Button
      variant="danger-solid"
      style={{ marginInline: "auto", marginBlockStart: "2rem" }}
      onClick={() =>
        openModal(<DeleteWarning {...props} />, {
          center: true,
          closable: true,
          dismissible: true,
        })
      }
    >
      <DeleteIcon className="icon" />
    </Button>
  );
}

interface DeleteWarningProps extends DeleteButtonProps {}

function DeleteWarning({
  onDelete: deleteAction,
  label,
  message,
}: DeleteWarningProps) {
  const navigate = useNavigate();

  const [onDelete, isLoading] = useLoading(async (stopLoading) => {
    await deleteAction();
    stopLoading();
    navigate("/temp/sessions/track");
  });

  return (
    <FlashCard
      actions={
        <Button
          variant="danger-ghost"
          style={{ marginInline: "auto" }}
          isLoading={isLoading}
          onClick={onDelete}
        >
          {label}
        </Button>
      }
    >
      {message ? <p>{message}</p> : null}
    </FlashCard>
  );
}
