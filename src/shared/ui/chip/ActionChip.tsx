import { useState } from "react";
import { actionChipStyles } from "./chip.styles";

interface ActionChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "filled" | "outlined";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  isSelected: boolean;
  unControlledInitialIsSelect?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: string;
  isUncontrolled?: boolean;
}

export const ActionChip = ({
  variant,
  leadingIcon,
  children,
  trailingIcon,
  isSelected,
  onClick,
  isUncontrolled = false,
  ...props
}: ActionChipProps) => {
  const [unControlledIsSelected, setIsUnControlledIsSelected] =
    useState<boolean>(isSelected);

  const _isSelected = isUncontrolled ? unControlledIsSelected : isSelected;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isUncontrolled) {
      setIsUnControlledIsSelected((prev) => !prev);
    }
    onClick?.(e);
  };

  const paddingLeft = leadingIcon ? "pl-2" : "pl-3";
  const paddingRight = trailingIcon ? "pr-1" : "pr-3";

  const { base, selected, unSelected } = actionChipStyles;
  const colors = _isSelected ? selected[variant] : unSelected;

  return (
    <button
      onClick={handleClick}
      className={`${base} ${paddingLeft} ${paddingRight} ${colors} `}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
};
