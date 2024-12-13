import { ButtonHTMLAttributes } from "react";
import { colors, iconButtonSize } from "./selectedIconButton.style";

type IconComponentType = React.ComponentType<{
  width?: number;
  height?: number;
  fill?: string;
}>;

type SelectedIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  iconComponent: IconComponentType;
  size: "xSmall" | "small" | "medium" | "large";
  isSelected?: boolean;
};

const SelectedIconButton = ({
  iconComponent: IconComponent,
  size,
  isSelected,
  ...props
}: SelectedIconButtonProps) => {
  const baseStyles =
    "flex flex-shrink-0 items-center justify-center icon-in-button";
  const sizeStyles = iconButtonSize[size];
  const colorStyles = isSelected ? colors.selected : colors.unSelected;

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${colorStyles.enabled} ${colorStyles.focus} ${colorStyles.hover} ${colorStyles.active} ${colorStyles.disabled}`}
      {...props}
    >
      <IconComponent />
    </button>
  );
};

export default SelectedIconButton;
