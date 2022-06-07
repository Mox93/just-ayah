import { get } from "lodash";
import { useMemo, VFC } from "react";
import { Outlet } from "react-router-dom";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Header from "components/Header";
import SearchBar from "components/SearchBar";
import { usePageT } from "hooks";
import { substringMatch } from "utils/match";
import { useStudentContext } from "context";
import { pluck } from "utils";

interface StudentsProps {}

const Students: VFC<StudentsProps> = () => {
  const stu = usePageT("students");
  const {
    data: { studentIndex },
    get: getStudent,
  } = useStudentContext();

  const applySearch = useMemo(
    () =>
      substringMatch(studentIndex, {
        fields: { type: "exclude", names: ["id"] },
      }),
    [studentIndex]
  );

  return (
    <main className="Students">
      <Header title={stu("title")}>
        <SearchBar
          onChange={applySearch}
          onSelect={({ value: { id } }) => getStudent(id)}
          getKey={pluck("value.id")}
          showButton
          showResults
          overflowDir="start"
          renderSections={[
            ({ value, matches }) => ({
              value: value.name,
              matches: matches.name?.substrings,
            }),
            ({ value, matches }) =>
              value.phoneNumber.map((phoneNumber, index) => ({
                value: phoneNumber,
                matches: get(matches, `phoneNumber.${index}`)?.substrings,
              })),
          ]}
        />
        <Button variant="primary-outline" className="newButton">
          <PlusIcon className="icon" />
        </Button>
      </Header>
      <Outlet />
    </main>
  );
};

export default Students;
