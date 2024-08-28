import { useState } from "react";
import { selectChipStyles } from "./chip.styles";

interface SelectChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  controlledIsSelected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SelectChip = ({
  controlledIsSelected,
  onClick,
  label,
  ...rest
}: SelectChipProps) => {
  const [unControlledIsSelected, setIsUnControlledIsSelected] = useState(false);

  // 제어컴포넌트와 비제어컴포넌트를 구분하는 boolean 변수를 선언합니다.
  const isUncontrolled = typeof controlledIsSelected === "undefined";

  // 제어 컴포넌트와 비제어컴포넌트의 경우를 구분하여 내부에서 스타일에 사용할 state인 chipState를 결정합니다.
  const isSelected = isUncontrolled
    ? unControlledIsSelected
    : controlledIsSelected;

  const chipState = isSelected ? "selected" : "unselected";
  // 비제어 컴포넌트의 경우엔 내부의 상태를 업데이트하고 제어 컴포넌트의 경우에는 props로 받은 onClick을 호출합니다.
  // 이를 통해 제어 컴포넌트의 경우 부모 컴포넌트나 스토어의 상태를 업데이트 할 수 있습니다.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isUncontrolled) {
      setIsUnControlledIsSelected((prev) => !prev);
      return;
    }
    onClick?.(e);
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
