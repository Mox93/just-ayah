import { get } from "lodash";
import { useMemo } from "react";

import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import LanguageSelector from "components/Layouts/LanguageSelector";
import { usePopupContext } from "context";
import { HeaderProps as _HeaderProps } from "context/Header";
import { cn } from "utils";
import { substringMatch } from "utils/match";

import SearchBar from "../SearchBar";

interface HeaderProps extends _HeaderProps {
  className?: string;
}

export default function Header({
  className,
  title,
  dataIndex,
  indexState,
  onSearchSelect,
  newEntityButton: newEntityElement,
}: HeaderProps) {
  const { openModal } = usePopupContext();

  const applySearch = useMemo(
    () =>
      dataIndex &&
      substringMatch(dataIndex, {
        filter: { type: "omit", fields: ["id"] },
      }),
    [dataIndex]
  );

  return (
    <header className={cn("Header followSidebar", className)}>
      <div className="wrapper">
        {title && <h2 className="title">{title}</h2>}
        <div className="actions">
          {applySearch && (
            <SearchBar
              indexState={indexState}
              applySearch={applySearch}
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
          )}
          {newEntityElement && (
            <Button
              variant="primary-outline"
              size="small"
              iconButton
              onClick={() => openModal(newEntityElement, { closable: true })}
            >
              <PlusIcon className="icon" />
            </Button>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
