import {
  Dispatch,
  forwardRef,
  MouseEventHandler,
  ReactElement,
  Ref,
  useEffect,
  useReducer,
} from "react";

import { Button, DropdownButton } from "components/Buttons";
import Container from "components/Container";
import { CheckMark } from "components/Icons";
import { DropdownAction, useDropdown, useGlobalT } from "hooks";
import { UNKNOWN } from "models";
import { cn, mergeRefs, omit, capitalize } from "utils";
import {
  mapStatusType,
  Status,
  mapStatusString,
  StatusTypes,
  StatusVariants,
  getCustomStatus,
} from "models/status";
import StatusForm from "./StatusForm";

type State = {
  variant: StatusVariants;
  currentStatus: Status;
  activeStatus?: Status;
  onChange: Function;
  dropdownAction?: Dispatch<DropdownAction>;
};
type Action = {
  type: "setType" | "awaitValue" | "setValue";
  payload: Status;
};

const reduce = (
  { variant, currentStatus, onChange, dropdownAction = omit }: State,
  { type, payload }: Action
): State => {
  const state = { variant, onChange, dropdownAction };

  switch (type) {
    /*********************\
    |*** simple status ***|
    \*********************/
    case "setType":
      dropdownAction("close");
      switch (payload.type) {
        case currentStatus.type:
          return { ...state, currentStatus };
        default:
          onChange(payload);
          return { ...state, currentStatus: payload };
      }

    /**********************\
    |*** complex status ***|
    \**********************/
    case "awaitValue":
      return { ...state, currentStatus, activeStatus: payload };
    case "setValue":
      dropdownAction("close");
      onChange(payload);
      return { ...state, currentStatus: payload };
    default:
      return { ...state, currentStatus };
  }
};

interface StatusMenuProps<TVariant extends StatusVariants> {
  className?: string;
  variant: TVariant;
  status?: StatusTypes[TVariant];
  onChange?: (status: StatusTypes[TVariant]) => void;
  onClick?: MouseEventHandler;
}

const StatusMenu = <TVariant extends StatusVariants>(
  {
    className,
    variant,
    status,
    onClick,
    onChange = omit,
    ...props
  }: StatusMenuProps<TVariant>,
  ref: Ref<HTMLButtonElement>
) => {
  const glb = useGlobalT();

  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({
      className: cn("StatusMenu", className),
      onClick: "toggle",
    });

  const [{ currentStatus, activeStatus }, dispatch] = useReducer(reduce, {
    variant,
    currentStatus: status || { type: UNKNOWN },
    onChange,
    dropdownAction,
  });

  useEffect(() => {
    if (!isOpen && activeStatus)
      dispatch({ type: "setType", payload: currentStatus });
  }, [currentStatus, activeStatus, isOpen]);

  const commonProps = { ...props, variant: null, size: null };

  return dropdownWrapper(
    <DropdownButton
      {...commonProps}
      onClick={onClick}
      isOpen={isOpen}
      ref={mergeRefs(ref, driverRef)}
      className={cn("driver", variant, currentStatus.type)}
    >
      {mapStatusString(variant, currentStatus, {
        type: (t: string) => capitalize(glb(t)),
      }).join(" | ")}
    </DropdownButton>,
    () => (
      <Container variant="menu" ref={drivenRef} className="statusMenu">
        {mapStatusType(variant, (statusOption: Status) => {
          const isSelected =
            (activeStatus?.type || currentStatus.type) === statusOption.type;
          const customStatus = getCustomStatus(variant, statusOption.type);

          const wrapper = (statusButton: ReactElement) =>
            isSelected && customStatus ? (
              <div key={statusOption.type} className="customStatusWrapper">
                {statusButton}
                <StatusForm
                  onSubmit={(data) =>
                    dispatch({
                      type: "setValue",
                      payload: {
                        type: statusOption.type,
                        value: data[statusOption.type],
                      },
                    })
                  }
                  defaultValues={{
                    [statusOption.type]: statusOption.value,
                    [currentStatus.type]: currentStatus.value,
                  }}
                >
                  {customStatus?.field}
                </StatusForm>
              </div>
            ) : (
              statusButton
            );

          return wrapper(
            <Button
              {...commonProps}
              key={statusOption.type}
              className={cn("option", variant, statusOption.type)}
              onClick={() =>
                dispatch({
                  type: customStatus ? "awaitValue" : "setType",
                  payload: statusOption,
                })
              }
            >
              {capitalize(glb(statusOption.type))}
              {isSelected && <CheckMark />}
            </Button>
          );
        })}
      </Container>
    )
  );
};

export default forwardRef(StatusMenu);
