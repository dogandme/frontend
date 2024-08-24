export const inputStyles = {
  calender: {
    default: {
      base: "body-2 flex  h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-3 gap-1",
      enabled: "border-grey-0 bg-grey-0",
      hover: "hover:bg-grey-100 hover:border-grey-500",
      focus: "focus-within:border-green-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-green-500 hover:focus-within:bg-grey-0",
      disabled: "bg-grey-0 border-grey-100 pointer-events-none",
      statusTextClass: "text-grey-700",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-3 gap-1",
      enabled: "border-pink-500 bg-grey-0",
      hover: "hover:bg-grey-50 hover:border-pink-700",
      focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-pink-500 hover:focus-within:bg-grey-0",
      disabled: "pointer-events-none",
      statusTextClass: "text-pink-500",
    },
  },
  searchText: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl px-3 py-3 gap-1 ",
      enabled: "bg-grey-100 text-grey-700",
      hover: "hover:bg-grey-300 ",
      focus: "focus-within:bg-grey-100",
      focusHover: "hover:focus-within:bg-grey-100",
      disabled: "bg-grey-0 text-grey-300 pointer-events-none",
      statusTextClass: "",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl px-3 py-3 gap-1 ",
      enabled: "bg-grey-100 text-grey-700",
      hover: "hover:bg-grey-300",
      focus: "focus-within:bg-grey-100",
      focusHover: "hover:focus-within:bg-grey-100",
      disabled: "bg-grey-0 text-grey-300 pointer-events-none",
      statusTextClass: "",
    },
  },
  outlinedText: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2 ",
      enabled: "border-grey-300 bg-grey-0 text-grey-700",
      hover: "hover:border-grey-500 hover:bg-grey-100 hover:text-grey-700",
      focus:
        "focus-within:border-tangerine-500 focus-within:bg-grey-0 focus-within:text-grey-700",
      focusHover:
        "hover:focus-within:border-tangerine-500 hover:focus-within:bg-grey-0 hover:focus-within:text-grey-700",
      disabled: "border-grey-0 bg-grey-0 text-grey-300 pointer-events-none",
      statusTextClass: "text-grey-500",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2",
      enabled: "border-pink-500 bg-grey-0",
      hover: "hover:border-pink-700 hover:bg-grey-50",
      focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-pink-500 hover:focus-within:bg-grey-0",
      disabled: "pointer-events-none",
      statusTextClass: "text-pink-500",
    },
  },
  text: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2 border-none",
      enabled: "bg-grey-0 text-grey-700",
      hover: "hover:bg-grey-100 hover:text-grey-700",
      focus: "focus-within:bg-grey-0 focus-within:text-grey-700 ",
      focusHover:
        "hover:focus-within:bg-grey-0 hover:focus-within:text-grey-700",
      disabled: "bg-grey-0 text-grey-300 pointer-events-none",
      statusTextClass: "text-grey-700",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2 border-none",
      enabled: "bg-pink-50",
      hover: "hover:bg-pink-100",
      focus: "focus-within:bg-pink-50",
      focusHover: "hover:focus-within:bg-pink-50",
      disabled: "pointer-events-none",
      statusTextClass: "text-pink-500",
    },
  },
  timerText: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2",
      enabled: "border-grey-300 bg-grey-0 text-grey-700",
      hover: "hover:border-grey-500 hover:bg-grey-100 hover:text-grey-700",
      focus:
        "focus-within:border-tangerine-500 focus-within:bg-grey-0 focus-within:text-grey-700",
      focusHover:
        "hover:focus-within:border-tangerine-500 hover:focus-within:bg-grey-0 hover:focus-within:text-grey-700",
      disabled: "border-grey-0 bg-grey-0 text-grey-300 pointer-events-none",
      statusTextClass: "text-grey-500",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2",
      enabled: "border-pink-500 bg-grey-0",
      hover: "hover:border-pink-700 hover:bg-grey-50",
      focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-pink-500 hover:focus-within:bg-grey-0",
      disabled: "pointer-events-none",
      statusTextClass: "text-pink-500",
    },
  },
} as const;

export const baseStyles = {
  input:
    "h-[1.375rem] flex-1 overflow-hidden text-ellipsis whitespace-nowrap placeholder-grey-500 focus:outline-none disabled:placeholder:text-grey-300",
  statusText: "body-3 min-h-5 gap-[0.625rem] px-3 mb-3 mt-1 ",
};
