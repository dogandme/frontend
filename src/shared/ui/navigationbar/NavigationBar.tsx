import { navigationBarStyles, navigationBaseStyle } from "./Navigation.style";

export interface NavigationBarProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  componentType: keyof typeof navigationBarStyles;
  button: React.ReactNode;
  label?: React.ReactNode;
}

export const NavigationBar = ({
  componentType,
  button,
  label = <div className="invisible"></div>,
}: NavigationBarProps) => {
  const isButtonLeft = componentType === "buttonLeft";

  return (
    <nav
      className={`${navigationBaseStyle} ${navigationBarStyles[componentType]}`}
    >
      {isButtonLeft ? button : label}
      {isButtonLeft ? label : button}
    </nav>
  );
};
