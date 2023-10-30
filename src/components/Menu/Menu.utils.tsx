import { ChangeEventHandler, useEffect, useMemo, useState } from "react";

import { ReactComponent as SearchIcon } from "assets/icons/search-svgrepo-com.svg";
import { Input } from "components/Form";
import { Path } from "models";
import { ValueOrGetter, resolveIfValue, hasAtLeastOne } from "utils";
import { substringMatch } from "utils/match";
import { before } from "utils/position";

export interface UseListFilterProps<TOption> {
  options: ValueOrGetter<TOption[]>;
  searchFields?: Path<TOption>[];
  dir?: string;
}

export function useListFilter<TOption>({
  options,
  searchFields,
  dir,
}: UseListFilterProps<TOption>) {
  const [optionList, setOptionList] = useState(resolveIfValue(options, []));

  useEffect(() => setOptionList(options), [options]);

  const applyFilter = useMemo<ChangeEventHandler<HTMLInputElement> | undefined>(
    () =>
      hasAtLeastOne(searchFields)
        ? (e) => {
            const results = substringMatch(options, {
              filter: { type: "pick", fields: searchFields },
            })(e.target.value);

            setOptionList(
              results?.length ? results.map(({ value }) => value) : options
            );
          }
        : undefined,

    [searchFields, options]
  );

  return [
    optionList,
    hasAtLeastOne(searchFields) && (
      <Input
        dir={dir}
        className="searchField"
        onChange={applyFilter}
        autoComplete="off"
        autoFocus
        visibleBorder
      >
        {before("input", <SearchIcon className="icon" />)}
      </Input>
    ),
  ] as const;
}
