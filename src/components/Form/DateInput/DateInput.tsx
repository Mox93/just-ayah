import { isEqual } from "lodash";
import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useDateTimeT } from "hooks";
import { DateInfo, clampDate, toDateInfo } from "models/_blocks";
import { addZeros, cn } from "utils";
import { PositionalElement } from "utils/position";

import MenuInput from "../MenuInput";
import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";
import { DateRange, useDateRanges } from "./DateInput.utils";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<string>;
  errorMessage?: ReactNode;
  range?: DateRange;
  selected?: DateInfo;
  setValue?: (value: DateInfo) => void;
}

export default forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  {
    label,
    isRequired,
    isInvalid,
    children,
    errorMessage,
    className,
    range,
    selected,
    setValue,
    ...props
  },
  ref
) {
  const dts = useDateTimeT("symbols");

  const [date, setDate] = useState<Partial<DateInfo>>(
    selected || toDateInfo(props?.value) || {}
  );

  const { day, month, year } = date;
  const { day: _day, month: _month, year: _year } = selected || {};

  useEffect(() => {
    if (!isEqual(selected, date)) setDate(clampDate(selected || {}));
  }, [_day, _month, _year]);

  useEffect(() => {
    if (![day, month, year].includes(undefined))
      setValue?.(clampDate({ day, month, year }) as DateInfo);
  }, [day, month, year]);

  const update = useCallback(
    (key: keyof DateInfo) => (value?: number) =>
      value && setDate((state) => ({ ...state, [key]: value })),
    []
  );

  const { days, months, years } = useDateRanges({ ...range, day, month, year });

  return (
    <div className={cn("DateInput", className)}>
      <FieldHeader {...{ label, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      <input ref={ref} {...props} hidden readOnly />
      <FieldWrapper isInvalid={isInvalid} addPartitions contentFullWidth>
        <MenuInput
          className="day"
          options={days}
          selected={day}
          setValue={update("day")}
          placeholder={dts("day")}
          renderElement={(value) => addZeros(value, 2)}
        />
        <MenuInput
          className="month"
          options={months}
          selected={month}
          setValue={update("month")}
          placeholder={dts("month")}
          renderElement={(value) => addZeros(value, 2)}
        />
        <MenuInput
          className="year"
          options={years}
          selected={year}
          setValue={update("year")}
          placeholder={dts("year")}
          renderElement={(value) => addZeros(value, 4)}
        />
      </FieldWrapper>
      {errorMessage}
    </div>
  );
});
