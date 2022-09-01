import { useEffect, useMemo, VFC } from "react";

import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-svgrepo-com.svg";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Table, { FieldProps } from "components/Table";
import { useStudentEnrollContext } from "context";
import { useDateTimeT, useGlobalT, useLoading } from "hooks";
import { enrollLinkFromId } from "models/studentEnroll";

import NewEnroll from "./NewEnroll";
import Ellipsis from "components/Ellipsis";

interface EnrollLinksProps {}

const EnrollLinks: VFC<EnrollLinksProps> = () => {
  const glb = useGlobalT();
  const dtT = useDateTimeT("symbols");

  const { enrolls, fetchEnrolls, refreshEnroll, deleteEnroll } =
    useStudentEnrollContext();

  useEffect(() => {
    if (!enrolls.length) fetchEnrolls();
  }, [fetchEnrolls]);

  const fields: FieldProps[] = useMemo(
    () => [
      {
        name: "key",
        header: glb("friendlyName"),
        getValue: ({ enroll: { key } }) => key,
      },
      {
        name: "link",
        header: glb("link"),
        getValue: ({ id }) => {
          const link = enrollLinkFromId(id);

          return (
            <div className="link">
              <Ellipsis>{link}</Ellipsis>
              <Button
                className="copyLink"
                variant="primary-ghost"
                size="small"
                iconButton
                onClick={() => navigator.clipboard.writeText(link)}
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
        getValue: ({ enroll: { expiresAt } }) => {
          const hours = Math.round(
            (expiresAt.getTime() - new Date().getTime()) / 36e5
          );

          return hours > 0 ? (
            <p className="active">{`${glb("active")} | ${Math.round(
              hours
            )} ${dtT("hour")}`}</p>
          ) : (
            <p className="inactive">{glb("inactive")}</p>
          );
        },
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
    []
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
