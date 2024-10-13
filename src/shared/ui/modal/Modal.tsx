import React, { ReactElement } from "react";
import { Button } from "../button";
import { ButtonProps } from "../button/Button";
import { CloseIcon } from "../icon";
import { modalStyles } from "./Modal.styles";

type ModalType = keyof typeof modalStyles;

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  modalType: ModalType;
  className?: string;
}

const ModalWrapper = ({
  modalType,
  className = "",
  children,
  ...props
}: ModalProps) => {
  const modalBaseClassName = modalStyles[modalType];

  return (
    <section className={`${modalBaseClassName} ${className}`} {...props}>
      {children}
    </section>
  );
};

const Header = ({
  children,
  onClick,
  closeButtonAriaLabel = "모달창 닫기",
}: {
  children?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  closeButtonAriaLabel?: string;
}) => {
  return (
    <header className="flex justify-between">
      <h1 className="title-1 text-grey-900">{children}</h1>
      <button onClick={onClick} aria-label={closeButtonAriaLabel}>
        <CloseIcon />
      </button>
    </header>
  );
};

const Content = ({
  children,
  className = "",
}: Omit<ModalProps, "modalType">) => (
  <section className={`flex flex-col gap-8 ${className}`}>{children}</section>
);

const Footer = ({
  children,
  axis,
  className = "",
}: {
  children: React.ReactNode;
  axis: "row" | "col";
  className?: string;
}) => {
  return (
    <section className={`flex gap-2 flex-${axis} ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as ReactElement, {
              axis,
            })
          : child,
      )}
    </section>
  );
};

const FilledButton = ({
  onClick,
  colorType = "primary",
  size = "medium",
  className = "",
  children,
  axis,
  ...rest
}: Partial<Omit<ButtonProps, "variant">> & {
  children: React.ReactNode;
  onClick: ButtonProps["onClick"];
  axis?: "row" | "col";
}) => (
  <Button
    variant="filled"
    colorType={colorType}
    size={size}
    onClick={onClick}
    fullWidth={false}
    {...rest}
    className={`${axis === "row" && "flex-1"} ${className}`}
  >
    {children}
  </Button>
);

const TextButton = ({
  onClick,
  colorType = "primary",
  size = "medium",
  className = "",
  children,
  axis,
  ...rest
}: Partial<Omit<ButtonProps, "variant">> & {
  children: React.ReactNode;
  onClick: ButtonProps["onClick"];
  axis?: "row" | "col";
}) => (
  <Button
    variant="text"
    colorType={colorType}
    size={size}
    onClick={onClick}
    fullWidth={false}
    className={`${axis === "row" && "flex-1"} ${className}`}
    {...rest}
  >
    {children}
  </Button>
);

export const Modal = Object.assign(ModalWrapper, {
  Header,
  Content,
  Footer,
  FilledButton,
  TextButton,
});
