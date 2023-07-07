import { useNavigate } from "react-router-dom";

import { ReactComponent as DeleteIcon } from "assets/icons/delete-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { FlashCard } from "components/FlashMessages";
import { openModal } from "context";
import { useLoading } from "hooks";

interface DeleteButtonProps {
  onDelete: VoidFunction;
}

export default function DeleteButton({ onDelete }: DeleteButtonProps) {
  return (
    <Button
      variant="danger-solid"
      style={{ marginInline: "auto", marginBlockStart: "2rem" }}
      onClick={() =>
        openModal(<DeleteWarning onDelete={onDelete} />, {
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

function DeleteWarning({ onDelete: deleteAction }: DeleteWarningProps) {
  const navigate = useNavigate();

  const [onDelete, isLoading] = useLoading(async (stopLoading) => {
    await deleteAction();
    stopLoading();
    navigate("/temp/sessions/track");
  });

  return (
    <FlashCard>
      <Button
        variant="danger-ghost"
        style={{ marginInline: "auto" }}
        isLoading={isLoading}
        onClick={onDelete}
      >
        {"تأكيد حذف التقرير"}
      </Button>
    </FlashCard>
  );
}
