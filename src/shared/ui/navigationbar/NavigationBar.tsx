import { Children } from "react";
import { navigationBarStyles, navigationBaseStyle } from "./Navigation.style";

interface NavigationBarProps {
  componentType: keyof typeof navigationBarStyles;
  children: React.ReactNode;
}

const NavigationBar = ({ componentType, children }: NavigationBarProps) => {
  // 디자인 시스템을 벗어나는 사용을 방지하기 위한 방어 코드
  if (Children.count(children) !== 2) {
    throw new Error("children의 개수는 2개여야 합니다.");
  }

  return (
    <nav
      className={`${navigationBaseStyle} ${navigationBarStyles[componentType]}`}
    >
      {children}
    </nav>
  );
};

export default NavigationBar;
