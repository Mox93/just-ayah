import { get } from "lodash";
import { useMemo, VFC } from "react";
import { Outlet } from "react-router-dom";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Header from "components/Header";
import SearchBar from "components/SearchBar";
import { useMetaContext, usePopupContext, useStudentContext } from "context";
import { usePageT } from "hooks";
import { substringMatch } from "utils/match";
import { pluck } from "utils";

import NewStudent from "../NewStudent";

interface StudentsProps {}

const Students: VFC<StudentsProps> = () => {
  const stu = usePageT("students");
  const { getStudent } = useStudentContext();
  const {
    data: { studentIndex },
  } = useMetaContext();

  const { showPopup } = usePopupContext();

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
        <Button
          variant="primary-outline"
          iconButton
          onClick={() =>
            showPopup(<NewStudent />, {
              closable: true,
              dismissible: true,
            })
          }
        >
          <PlusIcon className="icon" />
        </Button>
      </Header>
      <Outlet />
    </main>
  );
};

export default Students;
