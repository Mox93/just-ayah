import { get } from "lodash";
import { useMemo, VFC } from "react";
import { Outlet } from "react-router-dom";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import Container from "components/Container";
import Header from "components/Header";
import SearchBar from "components/SearchBar";
import { useMetaContext, usePopupContext, useStudentContext } from "context";
import { useDropdown, usePageT } from "hooks";
import { substringMatch } from "utils/match";
import { pluck } from "utils";

import StudentForm from "../StudentForm";

interface StudentsProps {}

const Students: VFC<StudentsProps> = () => {
  const stu = usePageT("students");
  const { getStudent, generateLink } = useStudentContext();
  const {
    data: { studentIndex },
  } = useMetaContext();

  const { driverRef, drivenRef, dropdownAction, dropdownWrapper } = useDropdown(
    { overflowDir: "start", onClick: "toggle" }
  );
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
        {dropdownWrapper(
          <Button variant="primary-outline" iconButton ref={driverRef}>
            <PlusIcon className="icon" />
          </Button>,
          () => (
            <Container variant="menu" ref={drivenRef}>
              <Button
                variant="plain-text"
                onClick={() => {
                  generateLink().then((link) => {
                    showPopup(<p>{link}</p>, true);
                  });
                  dropdownAction("close");
                }}
              >
                {stu("generateLink")}
              </Button>
              <Button
                variant="plain-text"
                onClick={() => {
                  dropdownAction("close");
                  showPopup(<StudentForm />, true);
                }}
              >
                {stu("fillForm")}
              </Button>
            </Container>
          )
        )}
      </Header>
      <Outlet />
    </main>
  );
};

export default Students;
