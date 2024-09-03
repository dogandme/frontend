import { useState } from "react";
import { FloatingButtonStyles } from "./FloatingButton.styles";

interface FloatingButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  controlledIsActive?: boolean;
  onClick?: React.MouseEventHandler;
  imgSrc?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * 제어 컴포넌트와 비제어 컴포넌트로서의 역할을 수행하는 플로팅 버튼 컴포넌트입니다.
 */
export const FloatingButton = (props: FloatingButtonProps) => {
  const {
    controlledIsActive,
    onClick,
    imgSrc,
    disabled = false,
    children,
    ...rest
  } = props;

  if (!imgSrc && !children) {
    throw new Error("배경 이미지나 children 중 하나는 있어야 합니다.");
  }

  const [unControlledIsActive, setUnControlledIsActive] =
    useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (controlledIsActive === undefined) {
      setUnControlledIsActive((prev) => !prev);
    }
    onClick?.(e);
  };

  const isActive = controlledIsActive ?? unControlledIsActive;
  const { base, active, inactive } = FloatingButtonStyles;
  return (
    <button
      className={`${base} ${isActive ? active : inactive} `}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt="floating button background"
          className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover"
        />
      )}
      {children}
    </button>
  );
};
