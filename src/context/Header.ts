import { ReactElement, useEffect } from "react";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { RequestStateMap, UserIndex } from "models/blocks";
import { ValueOrGetter } from "utils";
import { MatchResult } from "utils/match";

export interface HeaderProps {
  title?: string;
  dataIndex?: ValueOrGetter<UserIndex[]>;
  indexState?: RequestStateMap;
  onSearchSelect?: (value: MatchResult<UserIndex>) => void;
  newEntityButton?: ReactElement;
}

interface HeaderStore extends HeaderProps {
  actions: {
    setProps: (props: HeaderProps) => void;
    clearProps: VoidFunction;
  };
}

const useHeaderStore = create<HeaderStore>()((set, get) => ({
  actions: {
    setProps: (props) => set(props),
    clearProps: () => {
      const { actions } = get();
      set({ actions }, true);
    },
  },
}));

export function useHeaderProps() {
  return useHeaderStore(({ actions, ...state }) => state, shallow);
}

export function useTitle() {
  return useHeaderStore((state) => state.title);
}

export function useSetHeaderProps(props: HeaderProps) {
  const { setProps, clearProps } = useHeaderStore((state) => state.actions);

  useEffect(() => {
    setProps(props);

    return clearProps;
  }, [clearProps, props, setProps]);
}
