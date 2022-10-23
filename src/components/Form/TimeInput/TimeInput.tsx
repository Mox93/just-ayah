import {
  FC,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
  useReducer,
} from "react";

import { useDateTimeT } from "hooks";
import {
  hours,
  minutes,
  TimeInfo,
  TimeInfo12H,
  to12H,
  to24H,
} from "models/dateTime";
import { cn, addZeros } from "utils";
import { PositionalElement } from "utils/position";

import MenuInput from "../MenuInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

const isTimeInfo = (time: any): time is TimeInfo12H =>
  time?.hour !== undefined && time?.minute !== undefined;

type State = Partial<TimeInfo12H>;
type Action = {
  type: "update" | "replace";
  payload: State;
  setValue?: (value: TimeInfo) => void;
};

const reduce = (state: State, { type, payload, setValue }: Action): State => {
  const newTime =
    type === "update"
      ? { ...state, ...payload }
      : type === "replace"
      ? { ...payload }
      : state;

  if (isTimeInfo(newTime)) setValue?.(to24H(newTime));

  return newTime;
};

interface TimeInputProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: string;
  minutesInterval?: number;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  errorMessage?: ReactNode;
  innerProps?: InputHTMLAttributes<HTMLInputElement>;
  selected?: TimeInfo;
  h24?: boolean;
  setValue?: (value: TimeInfo) => void;
}

const TimeInput: FC<TimeInputProps> = ({
  label,
  isRequired,
  isInvalid,
  children,
  errorMessage,
  className,
  innerProps,
  selected,
  h24,
  minutesInterval,
  setValue,
  ...props
}) => {
  const dts = useDateTimeT("symbols");
  const dtt = useDateTimeT();

  const [{ hour, minute, period }, dispatch] = useReducer(
    reduce,
    selected ? (h24 ? selected : to12H(selected)) : {}
  );

  const update = useCallback(
    (key: keyof TimeInfo12H) => (value?: any) =>
      value !== undefined &&
      dispatch({ type: "update", payload: { [key]: value }, setValue }),
    [setValue]
  );

  return (
    <div {...props} className={cn("TimeInput", className)}>
      <FieldHeader {...{ label, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      <input {...innerProps} hidden />
      <FieldWrapper
        dir="ltr"
        isInvalid={isInvalid}
        addPartitions
        partition={(key) => (
          <span key={key} className="colon">
            :
          </span>
        )}
        contentFullWidth
      >
        <MenuInput
          dir="ltr"
          className="hour"
          options={hours(h24)}
          selected={hour}
          setValue={update("hour")}
          placeholder={dts("hour")}
          renderElement={addZeros}
        />
        <MenuInput
          dir="ltr"
          className="minute"
          options={minutes(minutesInterval)}
          selected={minute}
          setValue={update("minute")}
          placeholder={dts("minute")}
          renderElement={addZeros}
        />
        {!h24 && (
          <MenuInput
            dir="ltr"
            className="period"
            options={["AM", "PM"]}
            selected={period}
            setValue={update("period")}
            placeholder={dtt("period")}
            renderElement={dtt}
          />
        )}
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default TimeInput;
