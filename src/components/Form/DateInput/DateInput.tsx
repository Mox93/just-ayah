import { DateInfo, clampDate, toDateInfo } from "models/dateTime";
import {
  FC,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useReducer,
} from "react";
import { cn, omit, range } from "utils";

import { PositionalElement } from "utils/position";
import { useDateTimeT } from "utils/translation";

import AutoCompleatInput from "../AutoCompleatInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

type State = {
  date: Partial<DateInfo>;
  yearsRange?: { start?: number; end?: number };
  setValue: (value: DateInfo) => void;
};
type Action = Partial<DateInfo>;

const reduce = ({ date, setValue }: State, action: Action) => {
  const newDate = { ...date, ...action };

  if (newDate?.day && newDate?.month && newDate?.year)
    setValue(newDate as DateInfo);

  return { setValue, date: newDate };
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
    setValue,
  });

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
        <AutoCompleatInput
          className="day"
          options={range(1, daysRange)}
          selected={date?.day}
          setValue={(day) => dispatch({ day })}
          placeholder={dts("day")}
        />
        <AutoCompleatInput
          className="month"
          options={range(1, 13)}
          selected={date?.month}
          setValue={(month) => dispatch({ month })}
          placeholder={dts("month")}
        />
        <AutoCompleatInput
          className="year"
          options={range(startYear, endYear)}
          selected={date?.year}
          setValue={(year) => dispatch({ year })}
          placeholder={dts("year")}
        />
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default DateInput;
