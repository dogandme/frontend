import { useState } from "react";
import { actionChipStyles } from "./chip.styles";

interface ActionChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "filled" | "outlined";
  leadingIcon?: React.ReactNode;
  label: string;
  trailingIcon?: React.ReactNode;
  controlledIsSelected?: boolean;
  unControlledInitialIsSelect?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ActionChip = ({
  variant,
  leadingIcon,
  label,
  trailingIcon,
  controlledIsSelected,
  unControlledInitialIsSelect = false,
  onClick,
  ...props
}: ActionChipProps) => {
  const [unControlledIsSelected, setIsUnControlledIsSelected] =
    useState<boolean>(() => (unControlledInitialIsSelect ? true : false));
  const isUncontrolled = typeof controlledIsSelected === "undefined";
  const isSelected = isUncontrolled
    ? unControlledIsSelected
    : controlledIsSelected;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsUnControlledIsSelected((prev) => !prev);
    onClick?.(e);
  };

  const paddingLeft = leadingIcon ? "pl-2" : "pl-3";
  const paddingRight = trailingIcon ? "pr-1" : "pr-3";

  const { base, selected, unSelected } = actionChipStyles;
  const colors = isSelected ? selected[variant] : unSelected;

  return (
    <button
      onClick={handleClick}
      className={`${base} ${paddingLeft} ${paddingRight} ${colors} `}
      {...props}
    >
      {leadingIcon}
      {label}
      {trailingIcon}
    </button>
  );
};
