import {
  ButtonHTMLAttributes,
  Children,
  forwardRef,
  isValidElement,
  ReactNode,
} from "react";
import { colors, getSizeStyles } from "./button.styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  colorType: "primary" | "secondary" | "tertiary";
  variant: "filled" | "outlined" | "text";
  size: "xSmall" | "small" | "medium" | "large";
  additionalClassName?: string;
  fullWidth?: boolean;
  children: ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      colorType,
      variant,
      size,
      children,
      fullWidth = true,
      additionalClassName = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex flex-shrink-0 items-center justify-center gap-[.625rem] rounded-[1rem] outline-none icon-in-button";
    const colorStyles = colors[colorType][variant];

    const childrenArray = Children.toArray(children);
    const isText = (child: ReactNode) =>
      typeof child === "string" ||
      (isValidElement(child) && child.type === "div") ||
      (isValidElement(child) && child.type === "span") ||
      (isValidElement(child) && child.type === "p");

    // children 하위의 하나의 자식만을 가지고 있는지 확인
    const hasOneChild = childrenArray.length === 1;

    // 첫 번째 child가 텍스트인지 확인
    const firstChild = childrenArray[0];
    const isFirstChildText = isText(firstChild);

    // 아이콘만 있는 경우
    const hasOnlyIcon = hasOneChild && !isFirstChildText;
    // 텍스트만 있는 경우
    const hasOnlyText = hasOneChild && isFirstChildText;

    // children에 있는 요소가 여러개인지 확인
    const haveTwoChildren = childrenArray.length === 2;

    if (childrenArray.length > 2) {
      throw new Error(
        "Button 컴포넌트는 최대 2개의 자식만 포함할 수 있습니다. 하나의 텍스트 또는 아이콘만 포함하거나, 아이콘과 텍스트를 함께 사용해주세요",
      );
    }

    // 마지막 child가 텍스트인지 확인
    const lastChild = childrenArray[childrenArray.length - 1];
    const isLastChildText = isText(lastChild);

    const isSameType =
      (isFirstChildText && isLastChildText) ||
      (!isFirstChildText && !isLastChildText);

    if (haveTwoChildren && isSameType) {
      throw new Error(
        "Button 컴포넌트에는 같은 타입의 요소를 여러개 포함할 수 없습니다.",
      );
    }

    const hasIconFirst =
      haveTwoChildren && !isFirstChildText && isLastChildText;
    const hasTextFirst =
      haveTwoChildren && isFirstChildText && !isLastChildText;

    const sizeStyles = getSizeStyles({
      size,
      hasOnlyIcon,
      hasOnlyText,
      hasIconFirst,
      hasTextFirst,
    });

    return (
      <button
        ref={ref}
        className={`${fullWidth && "w-full"} ${baseStyles} ${colorStyles.enabled} ${colorStyles.focus} ${colorStyles.hover} ${colorStyles.active} ${colorStyles.disabled} ${sizeStyles} ${additionalClassName}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
