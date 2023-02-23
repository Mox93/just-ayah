import { useState } from "react";

export default function useSelect(getAllIds: () => string[]) {
  const [selected, setSelected] = useState(new Set<string>());

  const toggleSelect = (checked: boolean, id?: string) =>
    id
      ? setSelected((state) => {
          if (checked) return new Set(state.add(id));

          if (state.delete(id)) return new Set(state);

          return state;
        })
      : setSelected(checked ? new Set(getAllIds()) : new Set());

  return [selected, toggleSelect] as const;
}
