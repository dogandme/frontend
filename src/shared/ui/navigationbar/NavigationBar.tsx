import { type ReactElement } from "react";
import { navigationBarStyles, navigationBaseStyle } from "./Navigation.style";

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
      className={`${navigationBaseStyle} ${navigationBarStyles[isButtonLeft ? "buttonLeft" : "buttonRight"]}`}
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
