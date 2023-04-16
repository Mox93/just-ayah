import { Button } from "components/Buttons";
import { FlashCard } from "components/FlashMessages";
import { useLoading } from "hooks";

interface SuccessMessageProps {
  startOver?: VoidFunction;
  undo?: VoidFunction;
}

export default function SuccessMessage({
  startOver,
  undo,
}: SuccessMessageProps) {
  const [onStartOver, startOverInProgress] = useLoading(async (stopLoading) => {
    await startOver?.();
    stopLoading();
  });

  const [onUndo, undoInProgress] = useLoading(async (stopLoading) => {
    await undo?.();
    stopLoading();
  });

  return (
    <FlashCard
      state="success"
      {...(startOver || undo
        ? {
            actions: (
              <>
                {startOver && (
                  <Button
                    variant="primary-text"
                    onClick={onStartOver}
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
