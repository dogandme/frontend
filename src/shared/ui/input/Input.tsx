import React from "react";
import { useState } from "react";
import { inputStyles, baseStyles } from "./input.styles";
import { Badge } from "../badge";

type ComponentType = keyof typeof inputStyles;
type StatusType = keyof (typeof inputStyles)[ComponentType];

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  componentType: keyof typeof inputStyles;
  label?: string;
  statusText?: string;
  essential?: boolean;
  isError?: boolean;
  disabled?: boolean;
  trailingNode?: React.ReactNode;
  leadingNode?: React.ReactNode;
}

const Input = ({
  id,
  componentType,
  label,
  statusText,
  essential = false,
  isError = false,
  disabled = false,
  trailingNode,
  leadingNode,
  ...props
}: InputProps) => {
  // focus 상태에만 글자가 보이게 하기 위한 state
  const [isFocus, setIsFocus] = useState<boolean>(false);
  // 휴먼에러를 방지하기 위해 leadingNode,trailingNode 유효성 확인
  if (React.Children.count(leadingNode) > 1) {
    throw new Error("leadingNode 하나의 노드만 가질 수 있습니다.");
  }
  if (React.Children.count(trailingNode) > 2) {
    throw new Error("trailingNode는 최대 2개의 노드만 가질 수 있습니다.");
  }

  // input 컴포넌트의 상태에 따라 적용되는 스타일
  const status: StatusType = isError ? "error" : "default";
  const statusStyles = inputStyles[componentType][status];
  const { statusTextClass, ...wrapperClassesObject } = statusStyles;

  // wrapper 에 해당하는 div에선 hover,focus에 대한 가상 선택자 스타일이 적용되지만
  // disabled에 대한 가상 선택자 스타일은 적용되지 않습니다.
  // 그렇기 때문에 disabled에 대한 스타일을 따로 분리하여 적용합니다.
  const {
    disabled: disableClass,
    enabled: enabledClass,
    ...restStylesObject
  } = wrapperClassesObject;
  const restClasses = Object.values(restStylesObject).join(" ");

  return (
    <div className="flex w-full flex-col items-start">
      {label && (
        <div className="flex gap-1 pb-2">
          <label htmlFor={id} className="title-3">
            {label}
          </label>
          {essential && <Badge colorType="primary" />}
        </div>
      )}
      <div
        className={`${restClasses} ${disabled ? disableClass : enabledClass}`}
      >
        {leadingNode}
        <input
          id={id}
          name={id}
          className={baseStyles.input}
          autoComplete="off"
          disabled={disabled}
          {...props}
          aria-label={label || "input"}
          // focus 상태일 때만 statusText를 보여주기 위한 이벤트 핸들러
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        {trailingNode}
      </div>
      {statusText !== undefined && (
        <p className={`${statusTextClass} ${baseStyles.statusText}`}>
          {isFocus && statusText}
        </p>
      )}
    </div>
  );
};

export default Input;
