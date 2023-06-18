import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ReactComponent as SearchIcon } from "assets/icons/search-svgrepo-com.svg";
import { formAtoms } from "components/Form"; // can't use formAtoms because of circular input
import Highlight from "components/Highlight";
import Menu from "components/Menu";
import { AnchorPoint, useDropdown, useGlobalT } from "hooks";
import { Converter, GetKey } from "models";
import { RequestStateMap } from "models/blocks";
import { identity } from "utils";
import { before } from "utils/position";
import { renderAttributes } from "utils/render";

interface Search {
  search: string;
}

const { Input, MiniForm, useForm } = formAtoms<Search>();

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
  indexState?: RequestStateMap;
  anchorPoint?: AnchorPoint;
  applySearch?: (searchKey: string) => TIndex[];
  onSubmit?: (results?: TIndex[]) => void;
  onSelect?: (result: TIndex) => void;
  getKey?: GetKey<TIndex>;
  renderSections?: RenderSections<TIndex>;
}

export default function SearchBar<TIndex>({
  showButton,
  showResults,
  anchorPoint,
  indexState,
  applySearch,
  onSubmit,
  onSelect,
  getKey = identity,
  renderSections,
}: SearchBarProps<TIndex> = {}) {
  const glb = useGlobalT();
  const [results, setResults] = useState<TIndex[]>();
  const { driverRef, drivenRef, dropdownWrapper, open, close } = useDropdown<
    HTMLDivElement,
    HTMLDivElement
  >({ anchorPoint });
  const formProps = useForm({
    onSubmit: (data) => {
      console.log(data);
      onSubmit?.(results);
    },
  });

  const searchKey = useRef<string>();

  const runSearch = useCallback(
    (value: string) => {
      searchKey.current = value;
      const searchResults = applySearch?.(value);
      (searchResults?.length ? open : close)();
      setResults(searchResults);
    },
    [applySearch, close, open]
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => runSearch(e.target.value),
    [runSearch]
  );

  useEffect(() => {
    if (indexState?.isSuccess && searchKey.current)
      runSearch(searchKey.current);
  }, [indexState?.isSuccess, runSearch]);

  const searchField = (
    <Input
      className="searchField"
      name="search"
      {...(showResults && { fieldRef: driverRef })}
      onFocus={results?.length ? open : undefined}
      onChange={onChange}
      autoComplete="off"
      visibleBorder
    >
      {before("input", <SearchIcon className="icon" />)}
    </Input>
  );

  const searchBar = showButton ? (
    <MiniForm
      className="searchForm"
      submitProps={{
        children: glb("search"),
        variant: "primary-solid",
        size: "small",
      }}
      {...formProps}
    >
      {searchField}
    </MiniForm>
  ) : (
    searchField
  );

  return (
    <div className="SearchBar">
      {showResults
        ? dropdownWrapper(
            searchBar,
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
          )
        : searchBar}
    </div>
  );
}
