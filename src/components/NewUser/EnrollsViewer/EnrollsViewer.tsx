import { useEffect } from "react";

import { Button } from "components/Buttons";
import { Table } from "components/Table";
import { useGlobalT, useLoading } from "hooks";

import NewEnroll from "../NewEnroll";
import { UserVariant } from "../NewUser.type";
import { ENROLL_CONTEXT, useTableFields } from "./EnrollsViewer.utils";

interface EnrollsViewerProps {
  variant: UserVariant;
}

export default function EnrollsViewer({ variant }: EnrollsViewerProps) {
  const glb = useGlobalT();

  const { context, DBClass } = ENROLL_CONTEXT[variant];

  const {
    enrolls,
    fetchEnrolls,
    refreshEnroll,
    updateEnrollName,
    deleteEnroll,
    addEnroll,
  } = context();

  useEffect(() => {
    if (!enrolls.length) fetchEnrolls();
  }, []);

  const fields = useTableFields({
    refreshEnroll,
    updateEnrollName,
    deleteEnroll,
  });

  const [loadEnrolls, isLoading] = useLoading((stopLoading) => {
    fetchEnrolls({ onCompleted: stopLoading });
  });

  return (
    <div className="EnrollsViewer">
      <NewEnroll addEnroll={addEnroll} DBClass={DBClass} />
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
}
