import { FunctionComponent, ReactNode } from "react";

import { cn } from "utils";

import "./style.scss";

export interface FieldProps {
  name: string;
  header: ReactNode;
  size?: string;
  fit?: boolean;
  className?: string;
  getValue?: (data: any) => ReactNode;
}

interface TableProps {
  fields: FieldProps[];
  data: { id: string; [key: string]: any }[];
  selected: Set<string>;
  toggleSelect: (checked: boolean, id: string) => void;
  toggleSelectAll: (checked: boolean) => void;
  className?: string;
}

const Table: FunctionComponent<TableProps> = ({
  fields,
  data,
  selected,
  toggleSelect,
  toggleSelectAll,
  className = "",
}) => {
  return (
    <table className={`table ${className}`}>
      <thead>
        <tr>
          <th className="prefix fit">
            <input
              type="checkbox"
              name="select-all"
              id={"all"}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              checked={data.length > 0 && selected.size === data.length}
            />
          </th>
          <th className="prefix fit">#</th>

          {fields.map((field) => (
            <th
              className={cn(
                {
                  fit: Boolean(field.fit),
                  clip: !field.fit,
                },
                field.className
              )}
              key={field.name}
              style={field.size ? { width: field.size } : {}}
            >
              {field.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id}>
            <td className="prefix fit">
              <input
                type="checkbox"
                name="select-item"
                id={row.id}
                checked={selected.has(row.id)}
                onChange={(e) => toggleSelect(e.target.checked, row.id)}
              />
            </td>
            <td className="prefix fit">{index + 1}</td>

            {fields.map((field) => (
              <td
                className={cn(
                  {
                    fit: Boolean(field.fit),
                    clip: !field.fit,
                  },
                  field.className
                )}
                key={`${row.id}.${field.name}`}
              >
                {field.getValue ? field.getValue(row) : row[field.name]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
