import { DateInfo, clampDate } from "models/dateTime";
import { FC, HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { cn, omit, range } from "utils";

import { PositionalElement } from "utils/position";
import { useDateTimeT } from "utils/translation";
import AutoCompleatInput from "../AutoCompleatInput";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

interface DateInputProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  errorMessage?: ReactNode;
  yearsRange?: { start?: number; end?: number };
  innerProps?: HTMLAttributes<HTMLInputElement>;
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
  setValue = omit,
  ...props
}) => {
  const dts = useDateTimeT("symbols");

  const [date, setDate] = useState<Partial<DateInfo>>();

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

  useEffect(() => {
    date?.day && date?.month && date?.year && setValue(date as DateInfo);
  }, [date]);

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
          setValue={(day) => setDate((state) => ({ ...state, day }))}
          placeholder={dts("day")}
        />
        <AutoCompleatInput
          className="month"
          options={range(1, 13)}
          selected={date?.month}
          setValue={(month) =>
            setDate((state) => clampDate({ ...state, month }))
          }
          placeholder={dts("month")}
        />
        <AutoCompleatInput
          className="year"
          options={range(startYear, endYear)}
          selected={date?.year}
          setValue={(year) => setDate((state) => clampDate({ ...state, year }))}
          placeholder={dts("year")}
        />
      </FieldWrapper>
      {errorMessage}
    </div>
  );
};

export default DateInput;
