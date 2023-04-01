import { get } from "lodash";
import { ReactNode } from "react";

import Container from "components/Container";
import { cn, pass } from "utils";

interface DataWithId {
  id: string;
}

export interface FieldProps<T> {
  name: string;
  header: ReactNode;
  size?: string;
  fit?: boolean;
  className?: string;
  getValue?: (data: T, index: number) => ReactNode;
}

interface TableProps<T> {
  className?: string;
  dir?: string;
  fields: FieldProps<T>[];
  data: T[];
  selected?: Set<string>;
  footer?: ReactNode;
  noCheckbox?: boolean;
  flat?: boolean;
  toggleSelect?: (checked: boolean, id?: string) => void;
  extraProps?: (data: T, index: number) => Record<string, any>;
}

const Table = <T extends DataWithId>({
  className,
  dir,
  fields,
  data,
  selected,
  footer,
  noCheckbox,
  flat,
  toggleSelect,
  extraProps = pass({}),
}: TableProps<T>) => {
  return (
    <Container className={cn("Table", className)} {...{ footer, dir, flat }}>
      <table className="prefix">
        <thead>
          <tr>
            {noCheckbox || (
              <th className="fit">
                <input
                  type="checkbox"
                  name="selectAll"
                  id={"all"}
                  onChange={(e) => toggleSelect?.(e.target.checked)}
                  checked={data.length > 0 && selected?.size === data.length}
                />
              </th>
            )}
            <th className="fit">#</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} {...extraProps(row, index)}>
              {noCheckbox || (
                <td className="fit">
                  <input
                    type="checkbox"
                    name="selectItem"
                    id={row.id}
                    checked={selected?.has(row.id)}
                    onChange={(e) => toggleSelect?.(e.target.checked, row.id)}
                  />
                </td>
              )}
              <td className="fit">{index + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="data">
        <thead>
          <tr>
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
              {fields.map(({ fit, className, name, getValue }) => (
                <td
                  className={cn({ fit, clip: !fit }, className)}
                  key={`${row.id}.${name}`}
                >
                  {getValue ? getValue(row, index) : get(row, name)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default Table;
