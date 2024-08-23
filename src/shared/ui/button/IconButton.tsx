import { ButtonHTMLAttributes } from "react";
import { colors, iconButtonSize } from "./iconButton.style";

type IconComponentType = React.ComponentType<{
  width?: number;
  height?: number;
  fill?: string;
}>;

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  iconComponent: IconComponentType;
  colorType: "primary" | "secondary";
  size: "xSmall" | "small" | "medium" | "large";
};

const IconButton = ({
  iconComponent: IconComponent,
  colorType,
  size,
  ...props
}: IconButtonProps) => {
  const baseStyles =
    "flex flex-shrink-0 items-center justify-center icon-in-button";
  const sizeStyles = iconButtonSize[size];
  const colorStyles = colors[colorType];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${colorStyles.enabled} ${colorStyles.focus} ${colorStyles.hover} ${colorStyles.active} ${colorStyles.disabled}`}
      {...props}
    >
      <IconComponent />
    </button>
  );
};

export default IconButton;
