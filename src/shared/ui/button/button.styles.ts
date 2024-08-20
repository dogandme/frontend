export const colors = {
  primary: {
    filled: {
      enabled: "bg-tangerine-500 text-grey-0",
      hover: "hover:bg-tangerine-700 hover:text-grey-0",
      focus: "focus-visible:bg-tangerine-700 focus-visible:text-grey-0",
      active: "active:bg-tangerine-900 active:text-grey-0",
      disabled:
        "disabled:pointer-events-none disabled:bg-tangerine-50 disabled:text-grey-0",
    },
    outlined: {
      enabled:
        "bg-grey-0 text-tangerine-500 border-tangerine-500 border-[.0625rem]",
      hover:
        "hover:bg-grey-50 hover:text-tangerine-500 hover:border-tangerine-500",
      focus:
        "focus-visible:bg-grey-50 focus-visible:text-tangerine-500 focus-visible:border-tangerine-500",
      active:
        "active:bg-grey-100 active:text-tangerine-500 active:border-tangerine-500",
      disabled:
        "disabled:pointer-events-none disabled:bg-grey-0 disabled:text-grey-500 disabled:border-grey-300",
    },
    text: {
      enabled: "text-tangerine-500",
      hover: "hover:bg-tangerine-50 hover:text-tangerine-500",
      focus: "focus-visible:bg-tangerine-50 focus-visible:text-tangerine-500",
      active: "active:bg-tangerine-100 active:text-tangerine-500",
      disabled: "disabled:pointer-events-none disabled:text-tangerine-100",
    },
  },
  secondary: {
    filled: {
      enabled: "bg-grey-900 text-grey-0",
      hover: "hover:bg-grey-700 hover:text-grey-0",
      focus: "focus-visible:bg-grey-700 focus-visible:text-grey-0",
      active: "active:bg-grey-500 active:text-grey-0",
      disabled:
        "disabled:pointer-events-none disabled:bg-grey-300 disabled:text-grey-0",
    },
    outlined: {
      enabled: "bg-grey-0 text-grey-900 border-grey-900 border-[.0625rem]",
      hover: "hover:bg-grey-50 hover:text-grey-900 hover:border-grey-900",
      focus:
        "focus-visible:bg-grey-50 focus-visible:text-grey-900 focus-visible:border-grey-900",
      active: "active:bg-grey-100 active:text-grey-900 active:border-grey-900",
      disabled:
        "disabled:pointer-events-none disabled:bg-grey-0 disabled:text-grey-300 disabled:border-grey-300",
    },
    text: {
      enabled: "text-grey-900",
      hover: "hover:bg-grey-50 hover:text-grey-900",
      focus: "focus-visible:bg-grey-50 focus-visible:text-grey-900",
      active: "active:bg-grey-100 active:text-grey-900",
      disabled: "disabled:pointer-events-none disabled:text-grey-300",
    },
  },
  tertiary: {
    filled: {
      enabled: "bg-grey-500 text-grey-0",
      hover: "hover:bg-grey-700 hover:text-grey-0",
      focus: "focus-visible:bg-grey-700 focus-visible:text-grey-0",
      active: "active:bg-grey-900 active:text-grey-0",
      disabled:
        "disabled:pointer-events-none disabled:bg-grey-100 disabled:text-grey-0",
    },
    outlined: {
      enabled: "bg-grey-0 text-grey-500 border-grey-500 border-[.0625rem]",
      hover: "hover:bg-grey-50 hover:text-grey-700 hover:border-grey-700",
      focus:
        "focus-visible:bg-grey-50 focus-visible:text-grey-700 focus-visible:border-grey-700",
      active: "active:bg-grey-100 active:text-grey-500 active:border-grey-500",
      disabled:
        "disabled:pointer-events-none disabled:text-grey-100 disabled:border-grey-100",
    },
    text: {
      enabled: "text-grey-500",
      hover: "hover:bg-grey-50 hover:text-grey-500",
      focus: "focus-visible:bg-grey-50 focus-visible:text-grey-500",
      active: "active:bg-grey-100 active:text-grey-500",
      disabled: "disabled:pointer-events-none disabled:text-grey-100",
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

export const getSizeStyles = ({
  size,
  hasOnlyIcon,
  hasOnlyText,
  hasIconFirst,
  hasTextFirst,
}: {
  size: "xSmall" | "small" | "medium" | "large";
  hasOnlyIcon: boolean;
  hasOnlyText: boolean;
  hasIconFirst: boolean;
  hasTextFirst: boolean;
}) => {
  if (hasOnlyIcon) {
    return `${sizes[size].base} ${sizes[size].onlyIcon}`;
  }
  if (hasOnlyText) {
    return `${sizes[size].base} ${sizes[size].onlyText}`;
  }
  if (hasIconFirst) {
    return `${sizes[size].base} ${sizes[size].iconFirst}`;
  }
  if (hasTextFirst) {
    return `${sizes[size].base} ${sizes[size].textFirst}`;
  }

  return "";
};
