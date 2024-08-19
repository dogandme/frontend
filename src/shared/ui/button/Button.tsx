import { ButtonHTMLAttributes, Children, isValidElement } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  colorType: "primary" | "secondary" | "tertiary";
  variant: "filled" | "outlined" | "text";
  size: "xSmall" | "small" | "medium" | "large";
};

const colors = {
  primary: {
    filled: {
      enabled: "bg-tangerine-500 text-grey-0",
      hover: "hover:bg-tangerine-700 hover:text-grey-0",
      focus: "focus:bg-tangerine-700 focus:text-grey-0",
      active: "active:bg-tangerine-900 active:text-grey-0",
      disabled: "disabled:bg-tangerine-50 disabled:text-grey-0",
    },
    outlined: {
      enabled:
        "bg-grey-0 text-tangerine-500 border-tangerine-500 border-[.0625rem]",
      hover:
        "hover:bg-grey-50 hover:text-tangerine-500 hover:border-tangerine-500",
      focus:
        "focus:bg-grey-50 focus:text-tangerine-500 focus:border-tangerine-500",
      active:
        "active:bg-grey-100 active:text-tangerine-500 active:border-tangerine-500",
      disabled:
        "disabled:bg-grey-0 disabled:text-grey-500 disabled:border-grey-300",
    },
    text: {
      enabled: "bg-grey-0 text-tangerine-500",
      hover: "hover:bg-tangerine-50 hover:text-tangerine-500",
      focus: "focus:bg-tangerine-50 focus:text-tangerine-500",
      active: "active:bg-tangerine-100 active:text-tangerine-500",
      disabled: "disabled:text-tangerine-100",
    },
  },
  secondary: {
    filled: {
      enabled: "bg-grey-900 text-grey-0",
      hover: "hover:bg-grey-700 hover:text-grey-0",
      focus: "focus:bg-grey-700 focus:text-grey-0",
      active: "active:bg-grey-500 active:text-grey-0",
      disabled: "disabled:bg-grey-300 disabled:text-grey-0",
    },
    outlined: {
      enabled: "bg-grey-0 text-grey-900 border-grey-900 border-[.0625rem]",
      hover: "hover:bg-grey-50 hover:text-grey-900 hover:border-grey-900",
      focus: "focus:bg-grey-50 focus:text-grey-900 focus:border-grey-900",
      active: "active:bg-grey-100 active:text-grey-900 active:border-grey-900",
      disabled:
        "disabled:bg-grey-0 disabled:text-grey-300 disabled:border-grey-300",
    },
    text: {
      enabled: "bg-grey-0 text-grey-900",
      hover: "hover:bg-grey-50 hover:text-grey-900",
      focus: "focus:bg-grey-50 focus:text-grey-900",
      active: "active:bg-grey-100 active:text-grey-900",
      disabled: "disabled:text-grey-300",
    },
  },
  tertiary: {
    filled: {
      enabled: "bg-grey-500 text-grey-0",
      hover: "hover:bg-grey-700 hover:text-grey-0",
      focus: "focus:bg-grey-700 focus:text-grey-0",
      active: "active:bg-grey-900 active:text-grey-0",
      disabled: "disabled:bg-grey-100 disabled:text-grey-0",
    },
    outlined: {
      enabled: "bg-grey-0 text-grey-500 border-grey-500 border-[.0625rem]",
      hover: "hover:bg-grey-50 hover:text-grey-700 hover:border-grey-700",
      focus: "focus:bg-grey-50 focus:text-grey-700 focus:border-grey-700",
      active: "active:bg-grey-100 active:text-grey-500 active:border-grey-500",
      disabled: "disabled:text-grey-100 disabled:border-grey-100",
    },
    text: {
      enabled: "bg-grey-0 text-grey-500",
      hover: "hover:bg-grey-50 hover:text-grey-500",
      focus: "focus:bg-grey-50 focus:text-grey-500",
      active: "active:bg-grey-100 active:text-grey-500",
      disabled: "disabled:text-grey-100",
    },
  },
} as const;

const sizes = {
  xSmall: {
    base: "btn-3 h-8",
    onlyIcon: "px-1",
    onlyText: "px-4",
    iconFirst: "pl-2 pr-4",
    textFirst: "pl-4 pr-2",
  },
  small: {
    base: "btn-2 h-10",
    onlyIcon: "px-2",
    onlyText: "px-6",
    iconFirst: "pl-4 pr-6",
    textFirst: "pl-6 pr-4",
  },
  medium: {
    base: "btn-2 h-12",
    onlyIcon: "px-3",
    onlyText: "px-6",
    iconFirst: "pl-4 pr-6",
    textFirst: "pl-6 pr-4",
  },
  large: {
    base: "btn-1 h-14",
    onlyIcon: "px-4",
    onlyText: "px-6",
    iconFirst: "pl-4 pr-6",
    textFirst: "pl-6 pr-4",
  },
} as const;

const Button = ({ colorType, variant, size, children, ...props }: Props) => {
  const baseStyles =
    "inline-flex flex-shrink-0 items-center justify-center gap-[.625rem] rounded-[1rem]";
  const colorStyles = colors[colorType][variant];

  const childrenArray = Children.toArray(children);

  // children 하위의 하나의 자식만을 가지고 있는지 확인
  const hasOneChild = childrenArray.length === 1;
  const firstChildElement = childrenArray[0];

  // 아이콘만 있는 경우
  const hasOnlyIcon =
    hasOneChild &&
    isValidElement(firstChildElement) &&
    firstChildElement.type === "svg";
  // 텍스트만 있는 경우
  const hasOnlyText = hasOneChild && typeof firstChildElement === "string";

  // children 하위의 두개의 자식을 가지고 있는지 확인
  const hasTwoChild = childrenArray.length === 2;
  const lastChildElement = childrenArray[childrenArray.length - 1];

  // 아이콘 + 텍스트
  const hasIconFirst =
    hasTwoChild &&
    isValidElement(firstChildElement) &&
    firstChildElement.type === "svg";
  // 텍스트 + 아이콘
  const hasTextFirst =
    hasTwoChild &&
    isValidElement(lastChildElement) &&
    lastChildElement.type === "svg";

  const sizeStyles = `${sizes[size].base} ${hasOnlyIcon && sizes[size].onlyIcon} ${hasOnlyText && sizes[size].onlyText} ${hasIconFirst && sizes[size].iconFirst} ${hasTextFirst && sizes[size].textFirst}`;

  return (
    <button
      className={`${baseStyles} ${colorStyles.enabled} ${colorStyles.focus} ${colorStyles.hover} ${colorStyles.active} ${colorStyles.disabled} ${sizeStyles}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
