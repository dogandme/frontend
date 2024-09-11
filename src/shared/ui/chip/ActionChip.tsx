import { useState } from "react";
import { actionChipStyles } from "./chip.styles";

interface ActionChipProps<T extends boolean | undefined>
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "filled" | "outlined";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: string;
  isSelected?: T;
  unControlledInitialIsSelected?: T extends boolean ? never : boolean;
}

export const ActionChip = <T extends boolean | undefined>({
  variant,
  leadingIcon,
  children,
  trailingIcon,
  isSelected,
  unControlledInitialIsSelected,
  onClick,
  ...props
}: ActionChipProps<T>) => {
  const isUncontrolled = typeof isSelected === "undefined";

  const [unControlledIsSelected, setIsUnControlledIsSelected] =
    useState<boolean>(unControlledInitialIsSelected || false);

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
