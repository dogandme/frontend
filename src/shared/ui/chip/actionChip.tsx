import { useState } from "react";
import { actionChipStyles } from "./chip.styles";

interface ActionChipBaseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "filled" | "outlined";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

interface ControlledActionChipProps extends ActionChipBaseProps {
  isSelected: boolean;
  unControlledInitialIsSelected?: never;
}

interface UnControlledActionChipProps extends ActionChipBaseProps {
  isSelected?: never;
  unControlledInitialIsSelected: boolean;
}

type ActionChipProps = ControlledActionChipProps | UnControlledActionChipProps;

export const ActionChip = ({
  variant,
  leadingIcon,
  children,
  trailingIcon,
  isSelected,
  unControlledInitialIsSelected,
  onClick,
  ...props
}: ActionChipProps) => {
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
