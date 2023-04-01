import Ellipsis from "components/Ellipsis";
import { useCourseIndex } from "context";
import { CourseIndex } from "models/course";
import { sortBy } from "utils";

import SelectionMenu, { SelectionMenuProps } from "./SelectionMenu";

interface CourseMenuProps
  extends Pick<
    SelectionMenuProps<CourseIndex>,
    "selected" | "onOptionChange"
  > {}

export default function CourseMenu({
  selected,
  onOptionChange,
}: CourseMenuProps) {
  const [courseIndex, { isLoading }] = useCourseIndex(sortBy("name"));

  return (
    <SelectionMenu
      {...{ selected, isLoading, onOptionChange }}
      options={courseIndex}
      size="small"
      isLoading={isLoading}
      getKey={({ id }) => id}
      renderElement={({ name }) => <Ellipsis>{name}</Ellipsis>}
      searchFields={["name"]}
    />
  );
}
