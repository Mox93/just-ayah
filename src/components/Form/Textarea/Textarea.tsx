import autoSize from "autosize";
import {
  forwardRef,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
  useLayoutEffect,
  useRef,
} from "react";

import { useUniqueId } from "hooks";
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

export default forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
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
  },
  ref
) {
  const innerRef = useRef(null);
  const _id = useUniqueId(name || "textarea");

  useLayoutEffect(() => {
    innerRef.current && autoSize(innerRef.current);
  }, []);

  return (
    <div className={cn("Textarea", className)} dir={dir}>
      <FieldHeader
        htmlFor={id || _id}
        {...{ label, required, isRequired, isInvalid }}
      >
        {children}
      </FieldHeader>

      {before("field", children)}
      <FieldWrapper
        isInvalid={isInvalid}
        alwaysVisible={visibleBorder}
        ref={fieldRef}
        expandable
      >
        {before("textarea", children)}
        <textarea
          {...{ ...props, name, required }}
          id={id || _id}
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
});
