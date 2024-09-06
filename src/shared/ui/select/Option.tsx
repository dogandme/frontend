import { LiHTMLAttributes, useRef } from "react";
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
  const ref = useRef<HTMLLIElement>(null);
  const { onClose } = useSelectContext();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
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
      ref={ref}
      onClick={handleClick}
      additionalClassName={textColorStyles}
      {...props}
    >
      {children}
    </List.Item>
  );
};

export default Option;
