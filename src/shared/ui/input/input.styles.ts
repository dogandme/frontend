import type { DesignSystem } from "./input.types";

const designSystem: DesignSystem = {
  textField: {
    default: {
      base: "flex flex-col items-start gap-1 self-stretch rounded-2xl border px-3 py-[13px]",
      enabled: "border-grey-500 bg-grey-0",
      hover: "hover:border-grey-700 hover: bg-grey-100",
      focus: "focus-within:border-tangerine-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-tangerine-500 hover:focus-within:bg-grey-0",
      disabled: "disabled:border-grey-100 diabled:bg-grey-0",
      supportingTextColor: "text-grey-700",
    },
    error: {
      base: "flex flex-col items-start gap-1 self-stretch rounded-2xl border px-3 py-[13px]",
      enabled: "border-pink-500 bg-grey-0",
      hover: "hover:border-pink-700 hover:bg-grey-100",
      focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-pink-500 hover:foc us-within:bg-grey-0",
      disabled: "",
      supportingTextColor: "text-pink-500",
    },
  },
  calanderInput: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-[4px] border px-3 py-3 gap-1",
      enabled: "border-grey-0 bg-grey-0",
      hover: "hover:bg-grey-100 hover:border-grey-500",
      focus: "focus-within:border-green-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-green-500 hover:focus-within:bg-grey-0",
      disabled: "disabled:bg-grey-0 disabled:border-grey-100",
      supportingTextColor: "text-grey-700",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-[4px] border px-3 py-3 gap-1",
      enabled: "border-pink-500 bg-grey-0",
      hover: "hover:bg-grey-50 hover:border-pink-700",
      focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-pink-500 hover:focus-within:bg-grey-0",
      disabled: "",
      supportingTextColor: "text-pink-500",
    },
  },
  searchTextInput: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl px-3 py-3 gap-1 ",
      enabled: "bg-grey-100 text-grey-700",
      hover: "hover:bg-grey-300",
      focus: "focus-within:bg-grey-100",
      focusHover: "hover:focus-within:bg-grey-100",
      disabled: "disabled:bg-grey-0 disabled:text-grey-300",
      supportingTextColor: "",
    },
  },
  outLinedTextInput: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2 ",
      enabled: "border-grey-300 bg-grey-0 text-grey-700",
      hover: "hover:border-grey-500 hover:bg-grey-100 hover:text-grey-700",
      focus:
        "focus-within:border-tangerine-500 focus-within:bg-grey-0 focus-within:text-grey-700",
      focusHover:
        "hover:focus-within:border-tangerine-500 hover:focus-within:bg-grey-0 hover:focus-within:text-grey-700",
      disabled:
        "disabled:border-grey-0 disabled:bg-grey-0 disabled:text-grey-300",
      supportingTextColor: "text-grey-500",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2",
      enabled: "border-pink-500 bg-grey-0",
      hover: "hover:border-pink-700 hover:bg-grey-50",
      focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-pink-500 hover:focus-within:bg-grey-0",
      disabled: "",
      supportingTextColor: "text-pink-500",
    },
  },
  textInput: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2 border-none",
      enabled: "bg-grey-0 text-grey-700",
      hover: "hover:bg-grey-100 hover:text-grey-700",
      focus: "focus-within:bg-grey-0 focus-within:text-grey-700 ",
      focusHover:
        "hover:focus-within:bg-grey-0 hover:focus-within:text-grey-700",
      disabled: "disabled:bg-grey-0 disabled:text-grey-300",
      supportingTextColor: "text-grey-700",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2 border-none",
      enabled: "bg-pink-50",
      hover: "hover:bg-pink-100",
      focus: "focus-within:bg-pink-50",
      focusHover: "hover:focus-within:bg-pink-50",
      disabled: "",
      supportingTextColor: "text-pink-500",
    },
  },
  timerTextInput: {
    default: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2",
      enabled: "border-grey-300 bg-grey-0 text-grey-700",
      hover: "hover:border-grey-500 hover:bg-grey-100 hover:text-grey-700",
      focus:
        "focus-within:border-tangerine-500 focus-within:bg-grey-0 focus-within:text-grey-700",
      focusHover:
        "hover:focus-within:border-tangerine-500 hover:focus-within:bg-grey-0 hover:focus-within:text-grey-700",
      disabled:
        "disabled:border-grey-0 disabled:bg-grey-0 disabled:text-grey-300",
      supportingTextColor: "text-grey-500",
    },
    error: {
      base: "body-2 flex h-12 items-center gap-1 self-stretch rounded-2xl border px-3 py-2",
      enabled: "border-pink-500 bg-grey-0",
      hover: "hover:border-pink-700 hover:bg-grey-50",
      focus: "focus-within:border-pink-500 focus-within:bg-grey-0",
      focusHover:
        "hover:focus-within:border-pink-500 hover:focus-within:bg-grey-0",
      disabled: "",
      supportingTextColor: "text-pink-500",
    },
  },
};

export default designSystem;
