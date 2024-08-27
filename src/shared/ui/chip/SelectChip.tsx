import { useState } from "react";
import { selectChipStyles } from "./chip.styles";

interface SelectChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const SelectChip = (props: SelectChipProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const chipState = isSelected ? "selected" : "unselected";

  const { onClick, label, ...rest } = props;
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
