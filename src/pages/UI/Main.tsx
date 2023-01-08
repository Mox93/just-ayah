import { useState, VFC } from "react";

import { Button } from "components/Buttons";
import { StatusMenu } from "components/DropdownMenu";
import { LoadingSpinner } from "components/Icons";
import LoadingPopup from "components/LoadingPopup";
import { useDirT } from "hooks";
import { mapStatusType, mapStatusVariant } from "models/blocks";
import Toast from "context/Popup/Toast";

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

const toastVariants = ["success", "info", "warning", "danger"] as const;

const rowStyle = {
  display: "flex",
  gap: "1rem",
  marginBlockEnd: "2rem",
  alignItems: "flex-end",
};

const colStyle = {
  display: "grid",
  gap: "1rem",
  marginBlockEnd: "2rem",
  alignItems: "flex-start",
};

const sectionHeaderStyle: any = {
  textTransform: "capitalize",
  marginBlockEnd: "0.5rem",
};

const MainUI: VFC<MainProps> = () => {
  const dirT = useDirT();

  const [isLoading, setIsLoading] = useState(false);

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

      <div style={rowStyle}>
        <LoadingSpinner />
        <Button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 5000);
          }}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Press to Load
        </Button>
      </div>

      <div style={colStyle}>
        {toastVariants.map((variant) => (
          <Toast
            key={variant}
            message={
              <>
                This is a <b>{variant}</b>
                {" message!\nMore details..."}
              </>
            }
            variant={variant}
          />
        ))}
      </div>

      {isLoading && <LoadingPopup message="Loading" />}
    </main>
  );
};

export default MainUI;
