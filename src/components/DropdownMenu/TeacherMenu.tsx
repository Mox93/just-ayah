import Ellipsis from "components/Ellipsis";
import { useTeacherIndex } from "context";
import { UserIndex } from "models/blocks";
import { sortBy } from "utils";

import SelectionMenu, { SelectionMenuProps } from "./SelectionMenu";

interface TeacherMenuProps
  extends Pick<SelectionMenuProps<UserIndex>, "selected" | "onOptionChange"> {}

export default function TeacherMenu({
  selected,
  onOptionChange,
}: TeacherMenuProps) {
  const [teacherIndex, { isLoading }] = useTeacherIndex(sortBy("name"));

  return (
    <SelectionMenu
      {...{ selected, isLoading, onOptionChange }}
      options={teacherIndex}
      size="small"
      getKey={({ id }) => id}
      renderElement={({ name }) => <Ellipsis>{name}</Ellipsis>}
      searchFields={["name"]}
    />
  );
}
