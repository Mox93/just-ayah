import { Button } from "components/Buttons";
import { FlashCard } from "components/FlashMessages";

interface SuccessMessageProps {
  close?: VoidFunction;
  undo?: VoidFunction;
}

export default function SuccessMessage({ close, undo }: SuccessMessageProps) {
  return (
    <FlashCard
      state="success"
      {...(close || undo
        ? {
            actions: (
              <>
                {close && (
                  <Button variant="primary-text" onClick={close}>
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
