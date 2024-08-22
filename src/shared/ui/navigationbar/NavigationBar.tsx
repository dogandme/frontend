import { navigationBarStyles, navigationBaseStyle } from "./Navigation.style";

interface NavigationBarProps {
  componentType: keyof typeof navigationBarStyles;
  button: React.ReactNode;
  label?: React.ReactNode;
}

const NavigationBar = ({
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

export default NavigationBar;
