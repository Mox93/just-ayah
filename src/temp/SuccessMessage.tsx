import { Button } from "components/Buttons";
import { FlashCard } from "components/FlashMessages";
import { useLoading } from "hooks";

interface SuccessMessageProps {
  newForm?: VoidFunction;
  undo?: VoidFunction;
}

export default function SuccessMessage({ newForm, undo }: SuccessMessageProps) {
  const [onNewForm, startOverInProgress] = useLoading(async (stopLoading) => {
    await newForm?.();
    stopLoading();
  });

  const [onUndo, undoInProgress] = useLoading(async (stopLoading) => {
    await undo?.();
    stopLoading();
  });

  return (
    <FlashCard
      state="success"
      {...(newForm || undo
        ? {
            actions: (
              <>
                {newForm && (
                  <Button
                    variant="primary-text"
                    onClick={onNewForm}
                    isLoading={startOverInProgress}
                  >
                    قم بعملية جديدة
                  </Button>
                )}
                {undo && (
                  <Button
                    variant="danger-text"
                    onClick={onUndo}
                    isLoading={undoInProgress}
                  >
                    تراجع
                  </Button>
                )}
              </>
            ),
          }
        : {})}
    >
      <h1 className="accent">تمة العملية بنجاح</h1>
    </FlashCard>
  );
}
