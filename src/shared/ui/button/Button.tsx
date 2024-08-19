import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  colorType: "primary" | "secondary" | "tertiary";
  variant: "filled" | "outlined" | "text";
  size: "xSmall" | "small" | "medium" | "large" | "xLarge";
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

const Button = ({ colorType, variant, ...props }: Props) => {
  const baseStyles =
    "inline-flex flex-shrink-0 items-center justify-center gap-[.625rem] rounded-[1rem]";
  const colorStyles = colors[colorType][variant];

  return (
    <button
      className={`${baseStyles} ${colorStyles.enabled} ${colorStyles.focus} ${colorStyles.hover} ${colorStyles.active} ${colorStyles.disabled}`}
      {...props}
    >
      Button
    </button>
  );
};

export default Button;
