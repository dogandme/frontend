import React from "react";
import { createContext, useContext } from "react";
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

const ModalTypeContext = createContext<ModalType | null>(null);
const ModalFooterAxisContext = createContext<"row" | "col" | null>(null);

const ModalWrapper = ({
  modalType,
  className = "",
  children,
  ...props
}: ModalProps) => {
  const modalBaseClassName = modalStyles[modalType];

  return (
    <section className={`${modalBaseClassName} ${className}`} {...props}>
      <ModalTypeContext.Provider value={modalType}>
        {children}
      </ModalTypeContext.Provider>
    </section>
  );
};

interface ModalHeaderProps {
  children?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  closeButtonAriaLabel?: string;
}

const Header = ({
  children,
  onClick,
  closeButtonAriaLabel = "모달창 닫기",
}: ModalHeaderProps) => {
  const modalType = useContext(ModalTypeContext);

  return (
    <header
      className={`flex justify-between ${modalType === "fullPage" && "py-2"}`}
    >
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

interface ModalFooterProps {
  children: React.ReactNode;
  axis: "row" | "col";
  className?: string;
}

const Footer = ({ children, axis, className = "" }: ModalFooterProps) => {
  return (
    <section className={`flex gap-2 flex-${axis} ${className}`}>
      <ModalFooterAxisContext.Provider value={axis}>
        {children}
      </ModalFooterAxisContext.Provider>
    </section>
  );
};

interface ModalButtonProps extends Partial<Omit<ButtonProps, "variant">> {
  children: React.ReactNode;
  onClick: ButtonProps["onClick"];
}

const FilledButton = ({
  onClick,
  colorType = "primary",
  size = "medium",
  className = "",
  children,
  ...rest
}: ModalButtonProps) => {
  const axis = useContext(ModalFooterAxisContext);

  return (
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
};

const TextButton = ({
  onClick,
  colorType = "primary",
  size = "medium",
  className = "",
  children,
  ...rest
}: ModalButtonProps) => {
  const axis = useContext(ModalFooterAxisContext);

  return (
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
};

export const Modal = Object.assign(ModalWrapper, {
  Header,
  Content,
  Footer,
  FilledButton,
  TextButton,
});
