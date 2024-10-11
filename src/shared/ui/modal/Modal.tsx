import React from "react";
import { Button } from "../button";
import { CloseIcon } from "../icon";
import { modalStyles } from "./Modal.styles";

type ModalType = keyof typeof modalStyles;

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  modalType: ModalType;
  className?: string;
}

// TODO 모든 컴포넌트를 리팩트링 하면 해당 컴포넌트는 지워져야 합니다.
// 현재는 해당 컴포넌트를 사용하는 곳이 많아서 지우지 못하고 있습니다.
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

const Content = ({ children }: { children: React.ReactNode }) => (
  <section className="flex flex-col gap-8">{children}</section>
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
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <Button
    size="medium"
    variant="filled"
    colorType="primary"
    onClick={onClick}
    fullWidth={false}
    className="flex-grow"
  >
    {children}
  </Button>
);

const TextButton = ({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <Button
    size="medium"
    variant="text"
    colorType="tertiary"
    onClick={onClick}
    fullWidth={false}
    className="flex-grow"
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
