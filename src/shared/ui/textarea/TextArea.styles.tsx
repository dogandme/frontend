export const textAreaStyles = {
  default: {
    base: "body-2 bg-grey-0 flex flex-col items-start gap-1 self-stretch rounded-2xl border px-3 py-[13px]",
    enabled: "border-grey-500",
    hover: "hover:border-grey-700 hover:bg-grey-100",
    focus: "focus-within:border-tangerine-500 focus-within:bg-grey-0",
    focusHover:
      "hover:focus-within:border-tangerine-500 hover:focus-within:bg-grey-0",
    disabled: "border-grey-100 pointer-events-none text-grey-300",
  },
  error: {
    base: "body-2 flex  flex-col items-start gap-1 self-stretch rounded-2xl border px-3 py-[13px]",
    enabled: "border-pink-500 bg-grey-0",
    hover: "hover:border-pink-700 hover:bg-grey-0",
    focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
    focusHover:
      "hover:focus-within:border-pink-500 hover:foc us-within:bg-grey-0",
    disabled: "pointer-events-none",
  },
} as const;

export const baseStyles = {
  textArea:
    "body-2 h-[4.875rem] resize-none self-stretch whitespace-normal text-grey-700 placeholder-grey-500 focus:outline-none disabled:text-grey-300 disabled:placeholder-grey-300",
};
