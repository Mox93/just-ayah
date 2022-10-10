import { useEffect, useMemo, useState } from "react";

import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-svgrepo-com.svg";
import { ReactComponent as EditIcon } from "assets/icons/edit-svgrepo-com.svg";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Countdown from "components/Countdown";
import Ellipsis from "components/Ellipsis";
import { EditableCell, FieldProps, Table } from "components/Table";
import { EnrollContext } from "context/Enroll";
import { useGlobalT, useLoading, useMessageT } from "hooks";
import { enrollLinkFromId, UserEnroll } from "models/enroll";
import { cn } from "utils";

import NewEnroll from "./NewEnroll";

interface EnrollLinksProps<TUser> {
  enrollContext: EnrollContext<TUser>;
  linkKey: string;
}

const EnrollLinks = <TUser,>({
  enrollContext,
  linkKey,
}: EnrollLinksProps<TUser>) => {
  const glb = useGlobalT();
  const msg = useMessageT();

  const {
    enrolls,
    fetchEnrolls,
    refreshEnroll,
    updateEnrollKey,
    deleteEnroll,
  } = enrollContext;

  const [editing, setEditing] = useState<string>();
  const [copied, setCopied] = useState<string>();

  useEffect(() => {
    if (copied) {
      setTimeout(
        () => setCopied((state) => (state === copied ? undefined : state)),
        1000
      );
    }
  }, [copied]);

  useEffect(() => {
    if (!enrolls.length) fetchEnrolls();
  }, [fetchEnrolls]);

  const fields = useMemo<FieldProps<UserEnroll<TUser>>[]>(
    () => [
      {
        name: "key",
        header: glb("friendlyName"),
        getValue: ({ id, enroll: { key } }) =>
          editing === id ? (
            <EditableCell
              value={key}
              onSubmit={(value) => {
                setEditing(undefined);
                updateEnrollKey(id, value);
              }}
              onCancel={() => setEditing(undefined)}
            />
          ) : (
            <div className="withAction">
              {key}
              <Button
                className="action"
                variant="primary-ghost"
                size="small"
                iconButton
                onClick={() => setEditing(id)}
              >
                <EditIcon className="icon" />
              </Button>
            </div>
          ),
      },
      {
        name: "link",
        header: glb("link"),
        getValue: ({ id }) => {
          const link = enrollLinkFromId(id, linkKey);

          return (
            <div className="withAction">
              <Ellipsis>{link}</Ellipsis>
              <div className={cn("headsUp", { active: copied === id })}>
                {msg("copied")}
              </div>
              <Button
                className="action"
                variant="primary-ghost"
                size="small"
                iconButton
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  setCopied(id);
                }}
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
              onClick={() => refreshEnroll(id)}
            >
              <RefreshIcon className="icon" />
            </Button>
            <Button
              variant="danger-ghost"
              size="small"
              iconButton
              onClick={() => deleteEnroll(id)}
            >
              <CrossIcon className="icon" />
            </Button>
          </div>
        ),
        fit: true,
      },
    ],
    [editing, copied]
  );

  const [loadEnrolls, isLoading] = useLoading((stopLoading) => {
    fetchEnrolls({
      options: { onFulfilled: stopLoading, onRejected: stopLoading },
    });
  });

  return (
    <div className="EnrollLinks">
      <NewEnroll enrollContext={enrollContext} />
      <Table
        fields={fields}
        data={enrolls}
        noCheckbox
        flat
        footer={
          <Button
            className="loadMore"
            variant="gray-text"
            onClick={loadEnrolls}
            isLoading={isLoading}
          >
            {glb("loadMore")}
          </Button>
        }
      />
    </div>
  );
};

export default EnrollLinks;
