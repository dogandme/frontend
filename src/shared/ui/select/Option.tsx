import { LiHTMLAttributes } from "react";
import List from "../list/List";
import { useSelectContext } from "./select.context";

interface OptionProps extends LiHTMLAttributes<HTMLLIElement> {
  isSelected?: boolean;
  disabled?: boolean;
}

const Option = ({
  children,
  isSelected = false,
  disabled = false,
  onClick,
  ...props
}: OptionProps) => {
  const { onClose } = useSelectContext();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) return;

    onClick?.(e);
    onClose();
  };

  const textColorStyles = disabled
    ? "text-grey-300"
    : isSelected
      ? "text-tangerine-500"
      : "text-grey-700";

  return (
    <List.Item
      onClick={handleClick}
      additionalClassName={textColorStyles}
      disabled={disabled}
      {...props}
    >
      {children}
    </List.Item>
  );
};

export default Option;
