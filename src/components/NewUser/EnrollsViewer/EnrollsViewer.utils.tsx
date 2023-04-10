import { useCallback, useMemo, useRef, useState } from "react";

import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-svgrepo-com.svg";
import { ReactComponent as EditIcon } from "assets/icons/edit-svgrepo-com.svg";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Countdown from "components/Countdown";
import Ellipsis from "components/Ellipsis";
import { EditableCell, FieldProps } from "components/Table";
import {
  useStudentEnrollContext,
  useStudentTermsUrl,
  useTeacherEnrollContext,
  useTeacherTermsUrl,
} from "context";
import { useGlobalT, useMessageT } from "hooks";
import { StudentEnroll } from "models/student";
import { TeacherEnroll } from "models/teacher";
import { DeleteDataFunc } from "models";
import { cn, pass } from "utils";

export const ENROLL_CONTEXT = {
  student: {
    context: useStudentEnrollContext,
    DBClass: StudentEnroll.DB,
    termsGetter: useStudentTermsUrl,
  },
  teacher: {
    context: useTeacherEnrollContext,
    DBClass: TeacherEnroll.DB,
    termsGetter: useTeacherTermsUrl,
  },
} as const;

function useCopyToClipboard() {
  const [copied, setCopied] = useState<string>();
  const timeout = useRef<NodeJS.Timeout>();

  const copy = useCallback((value: string) => {
    if (timeout.current !== undefined) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }

    navigator.clipboard.writeText(value);

    setCopied(value);

    timeout.current = setTimeout(() => {
      setCopied(undefined);
      timeout.current = undefined;
    }, 1e3);
  }, []);

  return [copied, copy] as const;
}

interface UseTableFieldsProps {
  refreshEnroll: (id: string, duration?: number | undefined) => void;
  updateEnrollName: (id: string, name: string) => void;
  deleteEnroll: DeleteDataFunc;
}

export function useTableFields({
  refreshEnroll,
  updateEnrollName,
  deleteEnroll,
}: UseTableFieldsProps) {
  const glb = useGlobalT();
  const msg = useMessageT();

  const [editing, setEditing] = useState<string>();
  const [copied, copyToClipboard] = useCopyToClipboard();

  return useMemo<FieldProps<StudentEnroll | TeacherEnroll>[]>(
    () => [
      {
        name: "name",
        header: glb("friendlyName"),
        getValue: ({ id, enroll: { name } }) =>
          editing === id ? (
            <EditableCell
              value={name}
              onSubmit={(value) => {
                setEditing(undefined);
                updateEnrollName(id, value);
              }}
              onCancel={pass(setEditing, undefined)}
            />
          ) : (
            <div className="withAction">
              {name}
              <Button
                className="action"
                variant="primary-ghost"
                size="small"
                iconButton
                onClick={pass(setEditing, id)}
              >
                <EditIcon className="icon" />
              </Button>
            </div>
          ),
      },
      {
        name: "link",
        header: glb("link"),
        getValue: ({ enrollUrl }) => {
          return (
            <div className="withAction">
              <Ellipsis position="center" dir="ltr">
                {enrollUrl}
              </Ellipsis>
              <div className={cn("headsUp", { active: copied === enrollUrl })}>
                {msg("copied")}
              </div>
              <Button
                className="action"
                variant="primary-ghost"
                size="small"
                iconButton
                onClick={pass(copyToClipboard, enrollUrl)}
              >
                <CopyIcon className="icon" />
              </Button>
            </div>
          );
        },
      },
      {
        name: "status",
        header: glb("status"),
        getValue: ({ enroll: { expiresAt } }) => (
          <Countdown
            expiresAt={expiresAt}
            maxUnit="hour"
            expiredMessage={glb("inactive")}
          />
        ),
        fit: true,
      },
      {
        name: "actions",
        header: "",
        getValue: ({ id }) => (
          <div className="actions">
            <Button
              variant="warning-ghost"
              size="small"
              iconButton
              onClick={pass(refreshEnroll, id)}
            >
              <RefreshIcon className="icon" />
            </Button>
            <Button
              variant="danger-ghost"
              size="small"
              iconButton
              onClick={pass(deleteEnroll, id, { applyLocally: true })}
            >
              <CrossIcon className="icon" />
            </Button>
          </div>
        ),
        fit: true,
      },
    ],
    [
      glb,
      editing,
      updateEnrollName,
      copied,
      msg,
      copyToClipboard,
      refreshEnroll,
      deleteEnroll,
    ]
  );
}
