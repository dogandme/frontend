import { LiHTMLAttributes, useRef } from "react";
import List from "../list/List";
import { useSelectContext } from "./select.context";

interface OptionProps extends LiHTMLAttributes<HTMLLIElement> {
  isSelected?: boolean;
}

const Option = ({
  children,
  isSelected = false,
  onClick,
  ...props
}: OptionProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const { onClose } = useSelectContext();

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onClick?.(e);
    onClose();
  };

  return (
    <List.Item
      ref={ref}
      isSelected={isSelected}
      onClick={handleClick}
      {...props}
    >
      {children}
    </List.Item>
  );
};

export default Option;
