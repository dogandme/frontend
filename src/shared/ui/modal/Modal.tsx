import React from "react";
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
}: {
  children: React.ReactNode;
  axis: "row" | "col";
}) => <section className={`flex gap-2 flex-${axis}`}>{children}</section>;

const FilledButton = ({
  onClick,
  colorType = "primary",
  size = "medium",
  className = "",
  children,
  ...rest
}: Partial<Omit<ButtonProps, "variant">> & { children: React.ReactNode }) => (
  <Button
    variant="filled"
    colorType={colorType}
    size={size}
    onClick={onClick}
    fullWidth={false}
    {...rest}
    className={className}
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
  ...rest
}: Partial<Omit<ButtonProps, "variant">> & { children: React.ReactNode }) => (
  <Button
    variant="text"
    colorType={colorType}
    size={size}
    onClick={onClick}
    fullWidth={false}
    className={className}
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
