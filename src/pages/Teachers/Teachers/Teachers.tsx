import { get } from "lodash";
import { useMemo, VFC } from "react";
import { Outlet } from "react-router-dom";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Header from "components/Header";
import SearchBar from "components/SearchBar";
import { useMetaContext, usePopupContext, useTeacherContext } from "context";
import { usePageT } from "hooks";
import { pluck } from "utils";
import { substringMatch } from "utils/match";

import NewTeacher from "../NewTeacher";

interface TeachersProps {}

const Teachers: VFC<TeachersProps> = () => {
  const tch = usePageT("teacher");

  const {} = useTeacherContext();
  const {
    data: { studentIndex },
  } = useMetaContext();

  const { showPopup } = usePopupContext();

  const applySearch = useMemo(
    () =>
      substringMatch(studentIndex, {
        filter: ["leave", ["id"]],
      }),
    [studentIndex]
  );

  return (
    <main className="Teachers">
      <Header title={tch("title")}>
        <SearchBar
          onChange={applySearch}
          onSelect={({ value: { id } }) => console.log(id)}
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
            showPopup(<NewTeacher />, {
              closable: true,
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

export default Teachers;
