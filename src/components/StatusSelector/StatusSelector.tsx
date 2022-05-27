import {
  Dispatch,
  forwardRef,
  MouseEventHandler,
  ReactElement,
  Ref,
  useEffect,
  useReducer,
} from "react";

import { Button } from "components/Buttons";
import Container from "components/Container";
import DropdownArrow from "components/DropdownArrow";
import { formAtoms } from "components/Form";
import { DropdownAction, useDirT, useDropdown, useGlobalT } from "hooks";
import { UNKNOWN } from "models";
import { cn, mergeCallbacks, mergeRefs, omit, capitalize } from "utils";
import {
  mapStatusType,
  Status,
  mapStatusString,
  StatusTypes,
  StatusVariants,
  getCustomStatus,
} from "models/status";

const { MiniForm } = formAtoms();

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

interface StatusSelectorProps<TVariant extends StatusVariants> {
  className?: string;
  variant: TVariant;
  status?: StatusTypes[TVariant];
  onChange?: (status: StatusTypes[TVariant]) => void;
  onClick?: MouseEventHandler;
}

const StatusSelector = <TVariant extends StatusVariants>(
  {
    className,
    variant,
    status,
    onClick,
    onChange = omit,
    ...props
  }: StatusSelectorProps<TVariant>,
  ref: Ref<HTMLButtonElement>
) => {
  const dirT = useDirT();
  const glb = useGlobalT();

  const { drivenRef, driverRef, isOpen, dropdownWrapper, dropdownAction } =
    useDropdown({ className: cn("StatusButton", className) });

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
    <Button
      {...commonProps}
      onClick={mergeCallbacks(onClick, () => dropdownAction("toggle"))}
      ref={mergeRefs(ref, driverRef)}
      className={cn("driver", variant, currentStatus.type)}
    >
      {mapStatusString(variant, currentStatus, {
        type: (t: string) => capitalize(glb(t)),
      }).join(" | ")}
      <DropdownArrow dir={dirT} isOpen={isOpen} />
    </Button>,
    <Container variant="menu" ref={drivenRef} className="statusMenu">
      {isOpen &&
        mapStatusType(variant, (statusOption: Status) => {
          const selected =
            (activeStatus?.type || currentStatus.type) === statusOption.type;
          const customStatus = getCustomStatus(variant, statusOption.type);

          const onSubmit = (data: any) =>
            dispatch({
              type: "setValue",
              payload: {
                type: statusOption.type,
                value: data[statusOption.type],
              },
            });

          const onClick = () =>
            dispatch({
              type: customStatus ? "awaitValue" : "setType",
              payload: statusOption,
            });

          const wrapper = (statusButton: ReactElement) =>
            selected && customStatus ? (
              <div key={statusOption.type} className="customStatusWrapper">
                {statusButton}
                <MiniForm
                  onSubmit={onSubmit}
                  config={{
                    defaultValues: {
                      [statusOption.type]: statusOption.value,
                      [currentStatus.type]: currentStatus.value,
                    },
                  }}
                  noErrorMessage
                >
                  {customStatus?.field}
                </MiniForm>
              </div>
            ) : (
              statusButton
            );

          return wrapper(
            <Button
              {...commonProps}
              key={statusOption.type}
              className={cn({ selected }, "option", variant, statusOption.type)}
              onClick={onClick}
            >
              {capitalize(glb(statusOption.type))}
              {selected && <div className="checkMark" dir={dirT} />}
            </Button>
          );
        })}
    </Container>
  );
};

export default forwardRef(StatusSelector);
