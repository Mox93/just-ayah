import autoSize from "autosize";
import { uniqueId } from "lodash";
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
  fieldRef?: Ref<HTMLDivElement>;
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
    fieldRef,
    errorMessage,
    visibleBorder,
    name,
    id,
    ...props
  }: TextareaProps,
  ref: Ref<HTMLTextAreaElement>
) => {
  const dirT = useDirT();
  const innerRef = useRef(null);
  id = id || uniqueId(name ? `${name}-` : "textarea-");

  useEffect(() => {
    innerRef.current && autoSize(innerRef.current);
  }, [innerRef]);

  return (
    <div className={cn("Textarea", className)} dir={dir || dirT}>
      <FieldHeader htmlFor={id} {...{ label, required, isRequired, isInvalid }}>
        {children}
      </FieldHeader>

      {before("field", children)}
      <FieldWrapper
        {...{ isInvalid, dir }}
        alwaysVisible={visibleBorder}
        ref={fieldRef}
        expandable
      >
        {before("textarea", children)}
        <textarea
          {...props}
          {...{ name, required, id }}
          ref={mergeRefs(ref, innerRef)}
          dir="auto"
          placeholder={placeholder || label || " "}
          className="field"
        />
        {after("textarea", children)}
      </FieldWrapper>
      {after("field", children)}
      {errorMessage}
    </div>
  );
};

export default forwardRef(Textarea);
