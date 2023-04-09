import { SelectionMenu } from "components/DropdownMenu";
import { range } from "utils";

export default function SandboxUI() {
  const options = range(3).map((i) =>
    range(7)
      .map(() => `${i}`)
      .join("-")
  );

  return (
    <main className="Sandbox">
      {([false, true] as const).map((sideMounted) => (
        <div className="row">
          {(["top", "bottom"] as const).flatMap((block) =>
            (["start", "end"] as const).map((inline) => (
              <SelectionMenu
                options={options}
                anchorPoint={`${block}-${inline}`}
                selected={`${block}-${inline}`}
                sideMounted={sideMounted}
              />
            ))
          )}
        </div>
      ))}
    </main>
  );
}
