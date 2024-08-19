import React from "react";
import designSystem from "./input.styles";

// TODO 타입선언 제너럴하게 변경하기
type ComponentType =
  | "textfieldOutlined"
  | "textfieldFilled"
  | "searchTextInput"
  | "outLinedTextInput";
type Condition = "default" | "error";

/**
 * 해당 컴포넌트는 Input 필드의 디자인 시스템의 근간이 되는 컴포넌트입니다.
 * 여러 props 를 통해 Input 필드에 해당하는 디자인 시스템을 생성합니다.
 * 각 디자인 시스템에 해당하는 스타일들은은 input.styles.ts 에서 정의되어 있습니다.
 */

/**
 * 해당 타입은 디자인 시스템에 정의된 스타일을 사용하거나 컴포넌트의 스타일을 추가할 때 사용합니다.
 */
interface InputStyles {
  componentType: ComponentType;
  condition: Condition;
}

/**
 * input 컴포넌트 외부 속성에 존재하는 타입
 * TODO additionalStyle 속성 잘 사용하지 않는다면 props 에서 제거하도록 하기
 * additionalOutterStyle , additionalSupportingTextStyle 은 컴포넌트 외부에서 추가적인 스타일을 적용할 때 사용합니다.
 */
interface InputOutterProps {
  title: string;
  isSupportingNeeded?: boolean;
  supportingText?: string;
  additionalOutterStyle?: React.CSSProperties;
  additionalSupportingTextStyle?: React.CSSProperties;
}

/**
 * input 컴포넌트 내부 속성에 존재하는 타입
 */
interface InputInnerProps {
  id: string;
  leadingIcon?: React.ReactNode;
  countArea?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

/**
 * 유니온 타입 병합을 위해 interface 가 아닌 type으로 타입 선언
 */
export type InputProps = InputStyles &
  InputOutterProps &
  InputInnerProps &
  React.InputHTMLAttributes<HTMLInputElement>;

const BaseInput = ({
  title,
  id,
  leadingIcon,
  countArea,
  trailingIcon,
  isSupportingNeeded = true,
  supportingText,
  componentType,
  condition,
  additionalOutterStyle,
  additionalSupportingTextStyle,
  ...props
}: InputProps) => {
  const {
    base,
    enabled,
    hover,
    focus,
    focusHover,
    disabled,
    supportingTextColor,
  } = designSystem[componentType][condition];

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 pb-2">
        <label htmlFor={id} className="title-3">
          {title}
        </label>
      </div>
      <div
        className={`${base} ${enabled} ${hover} ${focus} ${focusHover} ${disabled}`}
        style={additionalOutterStyle}
      >
        {leadingIcon}
        <input
          id={id}
          name={id}
          className="placeholder-grey-500 disable:placeholder-grey-300 h-[1.375rem] flex-1 overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none"
          style={{
            backgroundColor: "transparent",
          }}
          autoComplete="off"
          {...props}
        />
        {countArea}
        {trailingIcon}
      </div>
      {isSupportingNeeded && (
        <p
          className={`${supportingTextColor} body-3 flex gap-[0.625rem] self-stretch px-3 pb-3 pt-1`}
          style={additionalSupportingTextStyle}
        >
          {supportingText}
        </p>
      )}
    </div>
  );
};

export default BaseInput;
