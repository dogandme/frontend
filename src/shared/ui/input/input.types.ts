type Condition = "default" | "error";

export interface DesignConditionMap {
  searchTextInput: "default";
  outLinedTextInput: Condition;
  plainTextInput: Condition;
  timerTextInput: Condition;
  calanderInput: Condition;
}

interface InputStyles {
  base: string;
  enabled: string;
  hover: string;
  focus: string;
  focusHover: string;
  disabled: string;
  supportingTextColor: string;
}

export type DesignSystem = {
  [K in keyof DesignConditionMap]: {
    [U in DesignConditionMap[K]]: InputStyles;
  };
};

interface InputDesignType<T extends keyof DesignConditionMap> {
  designType: T;
  condition: DesignConditionMap[T];
}

/**
 * input 컴포넌트 외부 속성에 존재하는 타입
 * additionalOutterStyle , additionalSupportingTextStyle 은 컴포넌트 외부에서 추가적인 스타일을 적용할 때 사용합니다.
 */
interface InputOutterProps {
  title?: string;
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
export type InputProps<T extends keyof DesignConditionMap> =
  InputDesignType<T> &
    InputOutterProps &
    InputInnerProps &
    React.InputHTMLAttributes<HTMLInputElement>;
