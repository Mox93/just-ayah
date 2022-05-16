import { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import Table from "components/Table";
import Tabs from "components/Tabs";
import { omit } from "utils";
import { usePageT } from "utils/translation";

interface TeachersProps {}

const Teachers: FunctionComponent<TeachersProps> = () => {
  const tch = usePageT("teachers");

  const tabs = ["active", "archived"].map((name, index) => ({
    id: `te_${index}`,
    name,
    value: tch(name),
  }));

  const [selected, setSelected] = useState(tabs[0].id);

  return (
    <div>
      <Tabs
        elements={tabs}
        selected={selected}
        onChange={(selection: string) => setSelected(selection)}
        actions={
          <Link className="addResource" to="/teachers/new">
            +
          </Link>
        }
      />

      <main className="mainSection">
        <Table
          fields={[
            { name: "name", header: "name" },
            { name: "age", header: "age", fit: true },
            { name: "country", header: "country" },
            { name: "name", header: "name" },
            { name: "age", header: "age", fit: true },
            { name: "country", header: "country" },
            { name: "name", header: "name" },
            { name: "age", header: "age", fit: true },
            { name: "country", header: "country" },
            { name: "name", header: "name" },
            { name: "age", header: "age", fit: true },
            { name: "country", header: "country" },
          ]}
          selected={new Set()}
          toggleSelect={omit}
          toggleSelectAll={omit}
          data={[
            {
              id: "m1",
              name: "mohamed ahmed",
              age: 32,
              country: "egypt",
            },
            {
              id: "m2",
              name: "faris kamal",
              age: 27,
              country: "libia",
            },
            {
              id: "f1",
              name: "asmaa fawzi",
              age: 33,
              country: "egypt",
            },
            {
              id: "m1",
              name: "mohamed ahmed",
              age: 32,
              country: "egypt",
            },
            {
              id: "m2",
              name: "faris kamal",
              age: 27,
              country: "libia",
            },
            {
              id: "f1",
              name: "asmaa fawzi",
              age: 33,
              country: "egypt",
            },
            {
              id: "m1",
              name: "mohamed ahmed",
              age: 32,
              country: "egypt",
            },
            {
              id: "m2",
              name: "faris kamal",
              age: 27,
              country: "libia",
            },
            {
              id: "f1",
              name: "asmaa fawzi",
              age: 33,
              country: "egypt",
            },
            {
              id: "m1",
              name: "mohamed ahmed",
              age: 32,
              country: "egypt",
            },
            {
              id: "m2",
              name: "faris kamal",
              age: 27,
              country: "libia",
            },
            {
              id: "f1",
              name: "asmaa fawzi",
              age: 33,
              country: "egypt",
            },
            {
              id: "m1",
              name: "mohamed ahmed",
              age: 32,
              country: "egypt",
            },
            {
              id: "m2",
              name: "faris kamal",
              age: 27,
              country: "libia",
            },
            {
              id: "f1",
              name: "asmaa fawzi",
              age: 33,
              country: "egypt",
            },
            {
              id: "m1",
              name: "mohamed ahmed",
              age: 32,
              country: "egypt",
            },
            {
              id: "m2",
              name: "faris kamal",
              age: 27,
              country: "libia",
            },
            {
              id: "f1",
              name: "asmaa fawzi",
              age: 33,
              country: "egypt",
            },
          ]}
        />
      </main>
    </div>
  );
};

export default Teachers;
