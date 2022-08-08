import {
  FC,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
  useReducer,
} from "react";

import { useDateTimeT } from "hooks";
import { DateInfo, clampDate, toDateInfo } from "models/dateTime";
import { cn, omit, range } from "utils";
import { PositionalElement } from "utils/position";

import MenuInput from "../MenuInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

type State = {
  date: Partial<DateInfo>;
  yearsRange?: { start?: number; end?: number };
};
type Action = {
  type: "update" | "replace";
  payload?: Partial<DateInfo>;
  setValue: (value: DateInfo) => void;
};

const reduce = (
  { date }: State,
  { type, payload, setValue }: Action
): State => {
  const newDate =
    type === "update"
      ? { ...date, ...payload }
      : type === "replace"
      ? { ...payload }
      : date;

  if (newDate?.day && newDate?.month && newDate?.year)
    setValue(newDate as DateInfo);

  return { date: newDate };
};

interface DateInputProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  errorMessage?: ReactNode;
  yearsRange?: { start?: number; end?: number };
  innerProps?: InputHTMLAttributes<HTMLInputElement>;
  selected?: DateInfo;
  setValue?: (value: DateInfo) => void;
}

const DateInput: FC<DateInputProps> = ({
  label,
  isRequired,
  isInvalid,
  children,
  errorMessage,
  className,
  yearsRange = {},
  innerProps,
  selected,
  setValue = omit,
  ...props
}) => {
  const dts = useDateTimeT("symbols");

  const [{ date }, dispatch] = useReducer(reduce, {
    date: selected || toDateInfo(innerProps?.value) || {},
  });

  const update = useCallback(
    (key: keyof DateInfo) => (value?: number) =>
      value &&
      dispatch({ type: "update", payload: { [key]: value }, setValue }),
    [setValue]
  );

  // TODO move these to a reducer init
  const now = new Date();
  const {
    start: startYear = now.getFullYear() - 100,
    end: endYear = now.getFullYear() + 101,
  } = yearsRange;

  const daysRange =
    clampDate({
      day: 31,
      month: date?.month,
      year: date?.year,
    }).day! + 1;

  return (
    <div {...props} className={cn("DateInput", className)}>
      <FieldHeader {...{ label, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      <input {...innerProps} hidden />
      <FieldWrapper isInvalid={isInvalid} addPartitions contentFullWidth>
        <MenuInput
          className="day"
          options={range(1, daysRange)}
          selected={date?.day}
          setValue={update("day")}
          placeholder={dts("day")}
        />
        <MenuInput
          className="month"
          options={range(1, 13)}
          selected={date?.month}
          setValue={update("month")}
          placeholder={dts("month")}
        />
        <MenuInput
          className="year"
          options={range(startYear, endYear)}
          selected={date?.year}
          setValue={update("year")}
          placeholder={dts("year")}
        />
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default DateInput;
