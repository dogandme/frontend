export const selectChipStyles = {
  selected: "bg-tangerine-500 text-grey-50",
  unselected: "bg-grey-0 text-grey-500",
  baseStyle:
    "btn-3 h-8 flex justify-center items-center gap-2 rounded-2xl border px-3",
} as const;

export const actionChipStyles = {
  base: "btn-3 border inline-flex h-8 justify-center items-center gap-2 rounded-2xl flex-shrink-0 focus:outline-none focus-visible:outline-none",
  selected: {
    filled:
      "bg-tangerine-500 border-tangerine-500 text-grey-50 hover:bg-tangerine-700 hover:border-tangerine-700 focus-visible:bg-tangerine-700 focus-visible:border-tangerine-700 active:bg-tangerine-900 active:border-tangerine-900 disabled:bg-tangerine-100 disabled:border-tangerine-100 disabled:text-grey-50",
    outlined:
      " border-tangerine-500 bg-grey-0 text-tangerine-500 hover:bg-grey-100 focus-visible:bg-grey-100 active:bg-grey-100 disabled:border-tangerine-300 disabled:text-tangerine-300",
  },
  unSelected:
    "border-grey-500 bg-grey-0 text-grey-500  disabled:border-grey-100 disabled:text-grey-100 disabled:bg-grey-0",
};

export const infoChipStyles = {
  base: "btn-3 inline-flex gap-1 items-center justify-center flex-shrink-0 border rounded-2xl border-grey-500 text-center text-grey-700",
  padding: {
    isTextOnly: "px-3",
    isNotTextOnly: "pl-2 pr-3",
  },
  size: {
    small: "h-6",
    medium: "h-8",
  },
} as const;
