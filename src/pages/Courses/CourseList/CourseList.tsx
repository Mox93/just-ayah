import { memo, useMemo } from "react";

import { Button } from "components/Buttons";
import { Table, FieldProps } from "components/Table";
import { useCourseStore } from "context";
import { useApplyOnce, useGlobalT, useLoading, useSelect } from "hooks";
import { IS_PROD } from "models/config";
import { Course } from "models/course";
import { historyRep } from "models/_blocks";

export default memo(function CourseList() {
  const glb = useGlobalT();

  const fields = useMemo<FieldProps<Course>[]>(
    () => [
      {
        name: "name",
        header: glb("name"),
        getValue: ({ data: { name } }) => name,
      },
      {
        name: "sessionCount",
        header: glb("numberOfSessions"),
        getValue: ({ data: { sessionCount } }) => sessionCount,
      },
      {
        name: "dateCreated",
        header: glb("dateCreated"),
        getValue: ({ meta: { dateCreated } }) => historyRep(dateCreated),
      },
    ],
    [glb]
  );

  const courses = useCourseStore((state) => state.data);
  const fetchCourses = useCourseStore((state) => state.fetch);

  const [selected, setSelect] = useSelect(() => [...courses.keys()]);

  const [loadCourses, isLoading] = useLoading((stopLoading) =>
    fetchCourses({ onCompleted: stopLoading })
  );

  useApplyOnce(loadCourses, IS_PROD && !courses.size);

  return (
    <Table
      {...{ fields, selected, setSelect }}
      data={courses}
      footer={
        <Button
          className="loadMore"
          variant="gray-text"
          onClick={loadCourses}
          isLoading={isLoading}
        >
          {glb("loadMore")}
        </Button>
      }
    />
  );
});
