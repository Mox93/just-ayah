import { ChangeEventHandler, useCallback, useMemo, useState } from "react";

import { ReactComponent as SearchIcon } from "assets/icons/search-svgrepo-com.svg";
import { formAtoms } from "components/Form"; // can't use formAtoms because of circular input
import Highlight from "components/Highlight";
import Menu from "components/Menu";
import { AnchorPoint, useDropdown, useGlobalT, useSmartForm } from "hooks";
import { Converter, GetKey } from "models";
import { identity, pass } from "utils";
import { before } from "utils/position";
import { renderAttributes } from "utils/render";

interface Search {
  search: string;
}

const { Input, MiniForm } = formAtoms<Search>();

type SearchRenderMap = {
  value: string;
  matches?: string[];
};

export type RenderSections<TIndex> = Converter<
  TIndex,
  SearchRenderMap | SearchRenderMap[]
>[];

interface SearchBarProps<TIndex> {
  showButton?: boolean;
  showResults?: boolean;
  anchorPoint?: AnchorPoint;
  onChange?: (searchKey: string) => TIndex[];
  onSubmit?: (results?: TIndex[]) => void;
  onSelect?: (result: TIndex) => void;
  getKey?: GetKey<TIndex>;
  renderSections?: RenderSections<TIndex>;
}

const SearchBar = <TIndex,>({
  showButton,
  showResults,
  anchorPoint,
  onChange: applySearch = pass([]),
  onSubmit,
  onSelect,
  getKey = identity,
  renderSections,
}: SearchBarProps<TIndex> = {}) => {
  const glb = useGlobalT();
  const [results, setResults] = useState<TIndex[]>();
  const { driverRef, drivenRef, dropdownWrapper, open, close } = useDropdown<
    HTMLDivElement,
    HTMLDivElement
  >({ anchorPoint });
  const formProps = useSmartForm<Search>({
    onSubmit: (data) => {
      console.log(data);
      onSubmit?.(results);
    },
  });

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const searchKey = e.target.value;

      const searchResults = applySearch(searchKey);

      if (searchResults?.length) {
        open();
      } else {
        close();
      }

      setResults(searchResults);
    },
    [applySearch]
  );

  const openMenu = useCallback(() => results?.length && open(), [results]);

  const searchField = useMemo(
    () => (
      <Input
        className="searchField"
        name="search"
        rules={{ onChange }}
        {...(showResults && { fieldRef: driverRef })}
        onClick={openMenu}
        onFocus={openMenu}
        autoComplete="off"
        visibleBorder
      >
        {before("input", <SearchIcon className="icon" />)}
      </Input>
    ),
    [showResults, driverRef, onChange, openMenu]
  );

  const searchBar = useMemo(
    () =>
      showButton ? (
        <MiniForm
          className="searchForm"
          submitProps={{ children: glb("search"), variant: "primary-solid" }}
          {...formProps}
        >
          {searchField}
        </MiniForm>
      ) : (
        searchField
      ),
    [showButton, searchField, glb, formProps]
  );

  return (
    <div className="SearchBar">
      {showResults
        ? dropdownWrapper(searchBar, () => (
            <Menu
              ref={drivenRef}
              options={results || []}
              getKey={getKey}
              {...(renderSections && {
                renderElement: renderAttributes(
                  renderSections,
                  (part, index) => (
                    <Highlight
                      key={index}
                      sections={part.matches}
                      className="searchResult"
                    >
                      {part.value}
                    </Highlight>
                  )
                ),
              })}
              onSelect={onSelect}
            />
          ))
        : searchBar}
    </div>
  );
};

export default SearchBar;