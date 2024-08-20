import { ButtonHTMLAttributes, Children, isValidElement } from "react";
import { colors, getSizeStyles } from "./button.styles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  colorType: "primary" | "secondary" | "tertiary";
  variant: "filled" | "outlined" | "text";
  size: "xSmall" | "small" | "medium" | "large";
};

const Button = ({ colorType, variant, size, children, ...props }: Props) => {
  const baseStyles =
    "inline-flex flex-shrink-0 items-center justify-center gap-[.625rem] rounded-[1rem] outline-none";
  const colorStyles = colors[colorType][variant];

  const childrenArray = Children.toArray(children);

  // children 하위의 하나의 자식만을 가지고 있는지 확인
  const hasOneChild = childrenArray.length === 1;
  const firstChild = childrenArray[0];
  const isFirstChildText = typeof firstChild === "string";

  // 아이콘만 있는 경우
  const hasOnlyIcon = hasOneChild && !isFirstChildText;
  // 텍스트만 있는 경우
  const hasOnlyText = hasOneChild && isFirstChildText;

  // children 하위의 두개의 자식을 가지고 있는지 확인
  const hasTwoChild = childrenArray.length === 2;
  const lastChild = childrenArray[childrenArray.length - 1];

  // 아이콘 + 텍스트
  const hasIconFirst =
    hasTwoChild && isValidElement(firstChild) && firstChild.type === "svg";
  // 텍스트 + 아이콘
  const hasTextFirst =
    hasTwoChild && isValidElement(lastChild) && lastChild.type === "svg";

  const sizeStyles = getSizeStyles({
    size,
    hasOnlyIcon,
    hasOnlyText,
    hasIconFirst,
    hasTextFirst,
  });

  return (
    <button
      className={`${baseStyles} ${colorStyles.enabled} ${colorStyles.focus} ${colorStyles.hover} ${colorStyles.active} ${colorStyles.disabled} ${sizeStyles}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
