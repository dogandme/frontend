import React from "react";
import { inputStyles, baseStyles } from "./input.styles";

type ComponentType = keyof typeof inputStyles;
type StatusType = keyof (typeof inputStyles)[ComponentType];

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  componentType: keyof typeof inputStyles;
  isError: boolean;
  statusText: null | string;
  trailingNode?: React.ReactNode;
  leadingNode?: React.ReactNode;
}

const Input = ({
  id,
  label,
  componentType,
  isError = false,
  statusText = null,
  trailingNode,
  leadingNode,
  ...props
}: InputProps) => {
  // 휴먼에러를 방지하기 위해 leadingNode,trailign,leadingNode의 유효성 확인
  if (React.Children.count(leadingNode) > 1) {
    throw new Error("leadingNode 하나의 노드만 가질 수 있습니다.");
  }
  if (React.Children.count(trailingNode) > 2) {
    throw new Error("trailingNode는 최대 2개의 노드만 가질 수 있습니다.");
  }

  // input 컴포넌트의 상태에 따라 적용되는 스타일
  const status: StatusType = isError ? "error" : "default";
  const statusStyles = inputStyles[componentType][status];
  const { statusTextclass, ...wrapperClasses } = statusStyles;

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 pb-2">
        <label htmlFor={id} className="title-3">
          {label}
        </label>
      </div>
      <div className={`${Object.values(wrapperClasses).join(" ")}`}>
        {leadingNode}
        <input
          id={id}
          name={id}
          className={baseStyles.input}
          style={{
            backgroundColor: "transparent",
          }}
          autoComplete="off"
          {...props}
        />
        {trailingNode}
      </div>
      {statusText !== null && (
        <p className={`${statusTextclass} ${baseStyles.statusText}`}>
          {statusText}
        </p>
      )}
    </div>
  );
};

export default Input;
