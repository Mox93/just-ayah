import { VFC } from "react";

import Table from "components/Table";
import { omit } from "utils";

interface TeachersProps {}

const Teachers: VFC<TeachersProps> = () => {
  return (
    <div>
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
