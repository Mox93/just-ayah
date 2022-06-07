import { ReactNode, VFC } from "react";

import Container from "components/Container";
import { cn, pass } from "utils";
import { useDirT } from "hooks";

export interface FieldProps {
  name: string;
  header: ReactNode;
  size?: string;
  fit?: boolean;
  className?: string;
  getValue?: (data: any) => ReactNode;
}

interface TableProps {
  className?: string;
  dir?: string;
  fields: FieldProps[];
  data: { id: string; [key: string]: any }[];
  selected: Set<string>;
  footer?: ReactNode;
  toggleSelect: (checked: boolean, id: string) => void;
  toggleSelectAll: (checked: boolean) => void;
  extraProps?: (data: any, index: number) => Record<string, any>;
}

const Table: VFC<TableProps> = ({
  className,
  dir,
  fields,
  data,
  selected,
  footer,
  toggleSelect,
  toggleSelectAll,
  extraProps = pass({}),
}) => {
  const dirT = useDirT();

  return (
    <Container className={cn("Table", className)} footer={footer}>
      <table className="prefix" dir={dir || dirT}>
        <thead>
          <tr>
            <th className="fit">
              <input
                type="checkbox"
                name="selectAll"
                id={"all"}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                checked={data.length > 0 && selected.size === data.length}
              />
            </th>
            <th className="fit">#</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} {...extraProps(row, index)}>
              <td className="fit">
                <input
                  type="checkbox"
                  name="selectItem"
                  id={row.id}
                  checked={selected.has(row.id)}
                  onChange={(e) => toggleSelect(e.target.checked, row.id)}
                />
              </td>
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
          {data.map((row) => (
            <tr key={row.id}>
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
    </Container>
  );
};

export default Table;
