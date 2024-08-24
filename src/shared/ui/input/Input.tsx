import React from "react";
import { useState } from "react";
import { inputStyles, baseStyles } from "./input.styles";
import { Badge } from "../badge";

type ComponentType = keyof typeof inputStyles;
type StatusType = keyof (typeof inputStyles)[ComponentType];

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  componentType: keyof typeof inputStyles;
  label?: string;
  statusText?: string;
  essential?: boolean;
  isError?: boolean;
  disabled?: boolean;
  trailingNode?: React.ReactNode;
  leadingNode?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = ({
  id,
  componentType,
  label,
  statusText,
  essential = false,
  isError = false,
  disabled = false,
  fullWidth = true,
  trailingNode,
  leadingNode,
  ...props
}: InputProps) => {
  // focus 상태에만 글자가 보이게 하기 위한 state
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const shouldShowStatusText = statusText !== undefined;

  // 외부에서  onFocus , onBlur 이벤트가 존재할 수 있기 때문에 이벤트 핸들러를 추가합니다.
  const { onFocus, onBlur, ...rest } = props;
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(event);
    }

    if (shouldShowStatusText) {
      setIsFocused(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event);
    }

    if (shouldShowStatusText) {
      setIsFocused(false);
    }
  };

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
    <div className={`flex ${fullWidth && "w-full"} flex-col items-start`}>
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
          aria-label={`${label ?? id}-input`}
          // focus 상태일 때만 statusText를 보여주기 위한 이벤트 핸들러
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {trailingNode}
      </div>
      {shouldShowStatusText && (
        <p
          className={`${statusTextClass} ${baseStyles.statusText}`}
          role="status"
          aria-label="status-text"
        >
          {
            // 에러 상태일 경우엔 focus 유무와 상관없이 statusText를 띄우고 에러가 아닐 경우엔 focus 시에만 나타나게 하자
            isError ? statusText : isFocused ? statusText : ""
          }
        </p>
      )}
    </div>
  );
};
