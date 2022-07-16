import { VFC } from "react";

import { Button } from "components/Buttons";
import { StatusMenu } from "components/DropdownMenu";
import { useDirT } from "hooks";
import { mapStatusType, mapStatusVariant } from "models/status";
import LoadingSpinner from "components/Icons/LoadingSpinner";

interface MainProps {}

const colorVariants = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "gray",
];
const fillVariants = ["solid", "outline", "text", "ghost"];
const sizes = ["large", "medium", "small"];

const rowStyle = { display: "flex", gap: "1rem", marginBlockEnd: "2rem" };
const sectionHeaderStyle: any = {
  textTransform: "capitalize",
  marginBlockEnd: "0.5rem",
};

const MainUI: VFC<MainProps> = () => {
  const dirT = useDirT();

  return (
    <main style={{ margin: "2rem 2rem 20rem" }} dir={dirT}>
      {sizes.map((size) =>
        fillVariants.map((fill) => (
          <div key={`${size}-${fill}`}>
            <h3 style={sectionHeaderStyle}>{`${size} ${fill} Buttons`}</h3>

            <div style={rowStyle}>
              {colorVariants.map((color) => (
                <Button
                  key={color}
                  variant={`${color}-${fill}` as any}
                  size={size as any}
                >
                  {color}
                </Button>
              ))}
              <Button
                variant={`primary-${fill}` as any}
                size={size as any}
                disabled
              >
                disabled
              </Button>
            </div>
          </div>
        ))
      )}

      {mapStatusVariant((variant) => (
        <div key={variant}>
          <h3 style={sectionHeaderStyle}>{`${variant} Status Buttons`}</h3>
          <div style={rowStyle}>
            {mapStatusType(variant, (status) => (
              <StatusMenu key={status.type} variant={variant} status={status} />
            ))}
            <StatusMenu variant={variant} />
          </div>
        </div>
      ))}

      <LoadingSpinner />
    </main>
  );
};

export default MainUI;
