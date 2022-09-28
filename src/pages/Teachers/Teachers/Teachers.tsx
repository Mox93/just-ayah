import { get } from "lodash";
import { useMemo, VFC } from "react";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { MainLayout } from "components/Layouts";
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
    data: { teacherIndex },
  } = useMetaContext();

  const { showPopup } = usePopupContext();

  const applySearch = useMemo(
    () =>
      substringMatch(teacherIndex, {
        filter: ["leave", ["id"]],
      }),
    [teacherIndex]
  );

  return (
    <MainLayout
      name="Teachers"
      title={tch("title")}
      actions={
        <>
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
        </>
      }
    />
  );
};

export default Teachers;
