const navigationStyles = {
  start: "px-1 justify-start",
  between: "pl-4 pr-1 justify-between",
  end: "justify-end",
};

export interface NavigationBarProps {
  children: React.ReactNode;
  justifyContent: keyof typeof navigationStyles;
}

export const NavigationBar = ({
  children,
  justifyContent,
}: NavigationBarProps) => {
  return (
    <nav
      className={`flex py-2 items-center text-grey-900 title-1 ${navigationStyles[justifyContent]}`}
    >
      {children}
    </nav>
  );
};
