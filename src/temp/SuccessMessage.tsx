import { Button } from "components/Buttons";
import { FlashCard } from "components/FlashMessages";

interface SuccessMessageProps {
  startOver?: VoidFunction;
  undo?: VoidFunction;
}

export default function SuccessMessage({
  startOver,
  undo,
}: SuccessMessageProps) {
  return (
    <FlashCard
      state="success"
      {...(startOver || undo
        ? {
            actions: (
              <>
                {startOver && (
                  <Button variant="primary-text" onClick={startOver}>
                    قم بعملية جديدة
                  </Button>
                )}
                {undo && (
                  <Button variant="danger-text" onClick={undo}>
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
