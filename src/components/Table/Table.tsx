import cn from "classnames";
import { FunctionComponent, ReactNode } from "react";

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
    <table className={`Table ${className}`}>
      <thead>
        <tr>
          <th className="prefix fit">
            <input
              type="checkbox"
              name="selectAll"
              id={"all"}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              checked={data.length > 0 && selected.size === data.length}
            />
          </th>
          <th className="prefix fit">#</th>

          {fields.map(({ fit, className, name, size, header }) => (
            <th
              className={cn({ fit, clip: !fit }, className)}
              key={name}
              style={size ? { width: size } : {}}
            >
              {header}
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
                name="selectItem"
                id={row.id}
                checked={selected.has(row.id)}
                onChange={(e) => toggleSelect(e.target.checked, row.id)}
              />
            </td>
            <td className="prefix fit">{index + 1}</td>

            {fields.map(({ fit, className, name, getValue }) => (
              <td
                className={cn({ fit, clip: !fit }, className)}
                key={`${row.id}.${name}`}
              >
                {getValue ? getValue(row) : row[name]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
