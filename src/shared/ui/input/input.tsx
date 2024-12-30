import React, { forwardRef } from "react";
import { Badge } from "../badge";
import { inputStyles, baseStyles } from "./input.styles";

type ComponentType = keyof typeof inputStyles;
type StatusType = keyof (typeof inputStyles)[ComponentType];

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  componentType: keyof typeof inputStyles;
  label?: string;
  essential?: boolean;
  isError?: boolean;
  disabled?: boolean;
  trailingNode?: React.ReactNode;
  leadingNode?: React.ReactNode;
}

export const InputWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col w-full">{children}</div>;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      componentType,
      label,
      essential = false,
      isError = false,
      disabled = false,
      trailingNode,
      leadingNode,
      ...rest
    },
    ref,
  ) => {
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
      <div>
        {label && (
          <div className="flex gap-1 pb-2">
            <label htmlFor={id} className="title-3 text-grey-700">
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
            ref={ref}
            id={id}
            name={id}
            className={baseStyles.input}
            autoComplete="off"
            disabled={disabled}
            {...rest}
          />
          {trailingNode}
        </div>
      </div>
    );
  },
);

export const StatusText = ({
  isError = false,
  children,
}: {
  isError?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={`${baseStyles.statusText} ${isError ? "text-pink-500" : "text-grey-500"}`}
    >
      {children}
    </p>
  );
};
