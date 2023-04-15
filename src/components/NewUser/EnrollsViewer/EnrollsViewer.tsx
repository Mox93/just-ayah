import { Button } from "components/Buttons";
import { Table } from "components/Table";
import { useApplyOnce, useGlobalT, useLoading, useStateSync } from "hooks";

import NewEnroll from "../NewEnroll";
import { UserVariant } from "../NewUser.type";
import { ENROLL_CONTEXT, useTableFields } from "./EnrollsViewer.utils";

interface EnrollsViewerProps {
  variant: UserVariant;
}

export default function EnrollsViewer({ variant }: EnrollsViewerProps) {
  const glb = useGlobalT();

  const { context, DBClass, termsGetter } = ENROLL_CONTEXT[variant];

  const {
    enrolls,
    fetchEnrolls,
    refreshEnroll,
    updateEnrollName,
    deleteEnroll,
    addEnroll,
  } = context();

  useApplyOnce(fetchEnrolls, !enrolls.length);

  const fields = useTableFields({
    refreshEnroll,
    updateEnrollName,
    deleteEnroll,
  });

  const [loadEnrolls, isLoading] = useLoading((stopLoading) =>
    fetchEnrolls({ onCompleted: stopLoading })
  );

  const [getTermsUrl, { isLoading: _isLoading }] = termsGetter();
  const [termsUrl] = useStateSync(getTermsUrl);

  return (
    <div className="EnrollsViewer">
      <NewEnroll
        {...{ addEnroll, DBClass, variant, termsUrl, isLoading: _isLoading }}
      />
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
