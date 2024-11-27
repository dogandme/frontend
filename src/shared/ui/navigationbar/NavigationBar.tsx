import { type ReactElement } from "react";

export interface NavigationBarProps {
  children:
    | [ReactElement<HTMLButtonElement>, string | undefined]
    | [string | undefined, ReactElement<HTMLButtonElement>];
}

export const NavigationBar = ({ children }: NavigationBarProps) => {
  const isButtonLeft =
    typeof children[1] === "string" || typeof children[1] === "undefined";
  return (
    <nav
      className={`flex py-2 px-1 items-center ${isButtonLeft ? "justify-start" : children[0] ? "justify-between" : "justify-end"}`}
    >
      {children.map((child) =>
        typeof child === "string" ? (
          <h1 className="text-grey-900 title-1">{child}</h1>
        ) : (
          child
        ),
      )}
    </nav>
  );
};
