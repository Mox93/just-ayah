import { get } from "lodash";
import { lazy, useMemo } from "react";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { MainLayout } from "components/Layouts";
import SearchBar from "components/SearchBar";
import { useMetaContext, usePopupContext } from "context";
import { usePageT } from "hooks";
import { substringMatch } from "utils/match";

const NewTeacher = lazy(() => import("../NewTeacher"));

export default function Teachers() {
  const tch = usePageT("teacher");

  const { teacherIndex } = useMetaContext();
  const { openModal } = usePopupContext();

  const applySearch = useMemo(
    () =>
      substringMatch(teacherIndex, {
        filter: { type: "omit", fields: ["id"] },
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
            onSelect={({ value: { id } }) => console.log(id)} // TODO Redirect to profile page
            getKey={({ value: { id } }) => id}
            showButton
            showResults
            overflowDir="start"
            renderSections={[
              ({ value, matches }) => ({
                value: value.name,
                matches: matches.name?.substrings,
              }),
              ({ value, matches }) =>
                (value.phoneNumber || []).map((phoneNumber, index) => ({
                  value: phoneNumber,
                  matches: get(matches, `phoneNumber.${index}`)?.substrings,
                })),
            ]}
          />
          <Button
            variant="primary-outline"
            iconButton
            onClick={() => openModal(<NewTeacher />, { closable: true })}
          >
            <PlusIcon className="icon" />
          </Button>
        </>
      }
    />
  );
}
