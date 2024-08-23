export const iconButtonSize = {
  xSmall: "w-5 h-5",
  small: "w-6 h-6",
  medium: "w-10 h-10 p-2",
  large: "w-12 h-12 p-3",
} as const;

export const colors = {
  primary: {
    enabled: "text-tangerine-500",
    hover: "hover:text-tangerine-700",
    focus: "focus-visible:text-tangerine-700",
    active: "active:text-tangerine-900",
    disabled: "disabled:pointer-events-none disabled:text-tangerine-100",
  },
  secondary: {
    enabled: "text-grey-500",
    hover: "hover:text-grey-700",
    focus: "focus-visible:text-grey-700",
    active: "active:text-grey-900",
    disabled: "disabled:pointer-events-none disabled:text-grey-300",
  },
} as const;
