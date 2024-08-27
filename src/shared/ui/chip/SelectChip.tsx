import { useState } from "react";
import { selectChipStyles } from "./chip.styles";

interface SelectChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SelectChip = ({ onClick, label, ...rest }: SelectChipProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const chipState = isSelected ? "selected" : "unselected";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    setIsSelected((prev: boolean) => !prev);
  };

  return (
    <button
      className={`${selectChipStyles.baseStyle} ${selectChipStyles[chipState]}`}
      onClick={handleClick}
      {...rest}
      type="button"
    >
      {label}
    </button>
  );
};
