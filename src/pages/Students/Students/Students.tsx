import { get } from "lodash";
import { useMemo, VFC } from "react";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { MainLayout } from "components/Layouts";
import SearchBar from "components/SearchBar";
import { useMetaContext, usePopupContext } from "context";
import { usePageT } from "hooks";
import { substringMatch } from "utils/match";
import { pluck } from "utils";

import NewStudent from "../NewStudent";

interface StudentsProps {}

const Students: VFC<StudentsProps> = () => {
  const stu = usePageT("student");
  const { studentIndex } = useMetaContext();

  const { showPopup } = usePopupContext();

  const applySearch = useMemo(
    () =>
      substringMatch(studentIndex, {
        filter: ["leave", ["id"]],
      }),
    [studentIndex]
  );

  return (
    <MainLayout
      name="Students"
      title={stu("title")}
      actions={
        <>
          <SearchBar
            onChange={applySearch}
            onSelect={({ value: { id } }) => console.log(id)} // TODO Redirect to profile page
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
              })
            }
          >
            <PlusIcon className="icon" />
          </Button>
        </>
      }
    />
  );
};

export default Students;
