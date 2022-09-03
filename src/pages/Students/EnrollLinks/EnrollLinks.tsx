import { useEffect, useMemo, useState, VFC } from "react";

import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-svgrepo-com.svg";
import { ReactComponent as EditIcon } from "assets/icons/edit-svgrepo-com.svg";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Countdown from "components/Countdown";
import { EditableCell, FieldProps, Table } from "components/Table";
import { useStudentEnrollContext } from "context";
import { useGlobalT, useLoading } from "hooks";
import { enrollLinkFromId } from "models/studentEnroll";

import NewEnroll from "./NewEnroll";

interface EnrollLinksProps {}

const EnrollLinks: VFC<EnrollLinksProps> = () => {
  const glb = useGlobalT();

  const {
    enrolls,
    fetchEnrolls,
    refreshEnroll,
    updateEnrollKey,
    deleteEnroll,
  } = useStudentEnrollContext();

  const [editing, setEditing] = useState<string>();

  useEffect(() => {
    if (!enrolls.length) fetchEnrolls();
  }, [fetchEnrolls]);

  const fields: FieldProps[] = useMemo(
    () => [
      {
        name: "key",
        header: glb("friendlyName"),
        className: "withAction",
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
            <>
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
            </>
          ),
      },
      {
        name: "link",
        header: glb("link"),
        className: "withAction",
        getValue: ({ id }) => {
          const link = enrollLinkFromId(id);

          return (
            <>
              {link}
              <Button
                className="action"
                variant="primary-ghost"
                size="small"
                iconButton
                onClick={() => navigator.clipboard.writeText(link)}
              >
                <CopyIcon className="icon" />
              </Button>
            </>
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
    [editing]
  );

  const [loadEnrolls, isLoading] = useLoading((stopLoading) => {
    fetchEnrolls({
      options: { onFulfilled: stopLoading, onRejected: stopLoading },
    });
  });

  return (
    <div className="EnrollLinks">
      <NewEnroll />
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
