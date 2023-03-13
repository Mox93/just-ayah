import { get } from "lodash";
import { ReactElement, useMemo } from "react";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import LanguageSelector from "components/Layouts/LanguageSelector";
import SearchBar from "components/Layouts/SearchBar";
import { usePopupContext } from "context";
import { useDirT } from "hooks";
import { UserIndex } from "models/blocks";
import { cn, toTitle } from "utils";
import { MatchResult, substringMatch } from "utils/match";

export interface HeaderProps {
  title: string;
  dataIndex: UserIndex[];
  onSearchSelect: (value: MatchResult<UserIndex>) => void;
  className?: string;
  newEntityElement: ReactElement;
}

export default function Header({
  className,
  title,
  dataIndex,
  onSearchSelect,
  newEntityElement,
}: HeaderProps) {
  const dirT = useDirT();

  const { openModal } = usePopupContext();

  const applySearch = useMemo(
    () =>
      substringMatch(dataIndex, {
        filter: { type: "omit", fields: ["id"] },
      }),
    [dataIndex]
  );

  return (
    <div className={cn("Header", className)} dir={dirT}>
      <div className="wrapper">
        <h2 className="title">{toTitle(title)}</h2>
        <div className="actions">
          <SearchBar
            onChange={applySearch}
            onSelect={onSearchSelect}
            getKey={({ value: { id } }) => id}
            showButton
            showResults
            anchorPoint="top-end"
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
            onClick={() => openModal(newEntityElement, { closable: true })}
          >
            <PlusIcon className="icon" />
          </Button>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}
