import { useState } from "react";

export default function useSelect(getAllIds: () => string[]) {
  const [selected, setSelected] = useState(new Set<string>());

  const toggleSelect = (checked: boolean, id?: string) =>
    id
      ? setSelected((state) => {
          if (checked) return state.has(id) ? state : new Set(state.add(id));

          return state.delete(id) ? new Set(state) : state;
        })
      : setSelected(checked ? new Set(getAllIds()) : new Set());

  return [selected, toggleSelect] as const;
}
