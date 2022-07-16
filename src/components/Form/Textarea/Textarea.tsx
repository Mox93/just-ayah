import autosize from "autosize";
import {
  forwardRef,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";

import { useDirT } from "hooks";
import { cn, mergeRefs } from "utils";
import { filterByPosition, PositionalElement } from "utils/position";

import FieldHeader from "../FieldHeader";
import FieldWrapper from "../FieldWrapper";

const locations = ["header", "field", "textarea"] as const;
type Location = typeof locations[number];

const { before, after } = filterByPosition<Location>();

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  children?: PositionalElement<Location>;
  labelRef?: Ref<HTMLLabelElement>;
  errorMessage?: ReactNode;
  visibleBorder?: boolean;
}

const Textarea = (
  {
    className,
    dir,
    label,
    placeholder,
    required,
    isInvalid,
    isRequired,
    children,
    labelRef,
    errorMessage,
    visibleBorder,
    ...props
  }: TextareaProps,
  ref: Ref<HTMLTextAreaElement>
) => {
  const dirT = useDirT();
  const fieldRef = useRef(null);

  useEffect(() => {
    fieldRef.current && autosize(fieldRef.current);
  }, [fieldRef]);

  return (
    <label
      className={cn("Textarea", className)}
      ref={labelRef}
      dir={dir || dirT}
    >
      <FieldHeader {...{ label, required, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      {before("field", children)}
      <FieldWrapper
        {...{ isInvalid, dir }}
        alwaysVisible={visibleBorder}
        expandable
      >
        {before("textarea", children)}
        <textarea
          {...props}
          required={required}
          ref={mergeRefs(ref, fieldRef)}
          dir="auto"
          placeholder={placeholder || label || " "}
          className="field"
        />
        {after("textarea", children)}
      </FieldWrapper>
      {after("field", children)}
      {errorMessage}
    </label>
  );
};

export default forwardRef(Textarea);
