import { identity } from "lodash";
import { ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ReactComponent as SearchIcon } from "assets/icons/search-svgrepo-com.svg";
import { Input, MiniForm } from "components/Form"; // can't use formAtoms because of circular input
import Highlight from "components/Highlight";
import Menu from "components/Menu";
import { OverflowDir, useDropdown, useGlobalT } from "hooks";
import { Converter, GetKey } from "models";
import { omit, pass } from "utils";
import { before } from "utils/position";
import { renderAttributes } from "utils/render";

type SearchRenderMap = {
  value: string;
  matches?: string[];
};

interface SearchBarProps<TIndex> {
  showButton?: boolean;
  showResults?: boolean;
  overflowDir?: OverflowDir;
  onChange?: (searchKey: string) => TIndex[];
  onSubmit?: (results?: TIndex[]) => void;
  onSelect?: (result: TIndex) => void;
  getKey?: GetKey<TIndex>;
  renderSections?: Converter<TIndex, SearchRenderMap | SearchRenderMap[]>[];
}

const SearchBar = <TIndex,>({
  showButton,
  showResults,
  overflowDir,
  onChange: applySearch = pass([]),
  onSubmit = omit,
  onSelect,
  getKey = identity,
  renderSections,
}: SearchBarProps<TIndex> = {}) => {
  const glb = useGlobalT();
  const { register, handleSubmit } = useForm<{ search: string }>();
  const [results, setResults] = useState<TIndex[]>();
  const { driverRef, drivenRef, dropdownAction, dropdownWrapper } = useDropdown(
    { overflowDir }
  );

  const resultsMenu = useMemo(
    () =>
      showResults
        ? () => (
            <Menu
              ref={drivenRef}
              items={results || []}
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
          )
        : null,
    [showResults, renderSections, drivenRef, results, getKey, onSelect]
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const searchKey = e.target.value;
      const searchResults = searchKey ? applySearch(searchKey) : undefined;

      dropdownAction(searchResults?.length ? "open" : "close");
      setResults(searchResults);
    },
    [applySearch, dropdownAction]
  );

  const openMenu = useCallback(
    () => results?.length && dropdownAction("open"),
    [results, dropdownAction]
  );

  const searchField = useMemo(() => {
    return (
      <Input
        className="searchField"
        {...register("search", { required: true, onChange })}
        {...(showResults && { labelRef: driverRef })}
        onClick={openMenu}
        onFocus={openMenu}
        autoComplete="off"
        visibleBorder
      >
        {before("input", <SearchIcon className="icon" />)}
      </Input>
    );
  }, [showResults, driverRef, register, onChange, openMenu]);

  const searchBar = useMemo(() => {
    return showButton ? (
      <MiniForm
        className="searchForm"
        submitProps={{ children: glb("search"), variant: "primary-solid" }}
        onSubmit={handleSubmit((data) => {
          console.log(data);
          onSubmit(results);
        })}
      >
        {searchField}
      </MiniForm>
    ) : (
      searchField
    );
  }, [showButton, results, searchField, glb, handleSubmit, onSubmit]);

  return (
    <div className="SearchBar">
      {showResults ? dropdownWrapper(searchBar, resultsMenu!) : searchBar}
    </div>
  );
};

export default SearchBar;
