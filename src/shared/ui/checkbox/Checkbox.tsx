import { InputHTMLAttributes, ReactNode, useEffect, useRef } from "react";
import { CheckboxIcon, CheckboxOutlineIcon, IndeterminateIcon } from "../icon";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  isIndeterminate?: boolean;
  children: ReactNode;
  gap?: string;
};

const colors = {
  checked: {
    default: "text-tangerine-500",
    hover: "group-hover:text-tangerine-700",
    focus: "group-focus:text-tangerine-700",
    active: "group-active:text-tangerine-900",
    disabled: "group-disabled:text-tangerine-100",
  },
  indeterminate: {
    default: "text-tangerine-500",
    hover: "group-hover:text-tangerine-700",
    focus: "group-focus:text-tangerine-700",
    active: "group-active:text-tangerine-900",
    disabled: "group-disabled:text-tangerine-100",
  },
  unchecked: {
    default: "text-grey-500",
    hover: "group-hover:text-grey-700",
    focus: "group-focus:text-grey-700",
    active: "group-active:text-grey-900",
    disabled: "group-disabled:text-grey-100",
  },
};

export const Checkbox = ({
  id,
  checked,
  isIndeterminate = false,
  gap = "0.25rem",
  children,
  ...props
}: CheckboxProps) => {
  const selectState = checked
    ? "checked"
    : isIndeterminate
      ? "indeterminate"
      : "unchecked";

  const colorStyles = Object.values(colors[selectState]).join(" ");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // indeterminate 라는 속성을 js로만 제어할 수 있어서 useEffect에서 처리
    // 선택 여부가 확정이 아닌 경우, indeterminate 속성을 true로 설정
    if (!checked && isIndeterminate) {
      inputRef.current.indeterminate = true;
      return;
    }

    inputRef.current.indeterminate = false;
  }, [checked, isIndeterminate]);

  if (isIndeterminate && checked) {
    throw new Error(
      "isIndeterminate와 checked를 동시에 true로 설정할 수 없습니다. 선택이 확실하지 않을 경우, checked를 false로 isIndeterminate를 true로 설정해주세요.",
    );
  }

  return (
    <label htmlFor={id} className={`relative block w-fit cursor-pointer`}>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        {...props}
        className="sr-only"
      />
      <div
        className={`group flex w-fit cursor-pointer items-center`}
        style={{ gap }}
      >
        <div className={`icon-in-button w-fit ${colorStyles}`}>
          {checked && !isIndeterminate && <CheckboxIcon />}
          {!checked && isIndeterminate && <IndeterminateIcon />}
          {!checked && !isIndeterminate && <CheckboxOutlineIcon />}
        </div>
        {children}
      </div>
    </label>
  );
};
