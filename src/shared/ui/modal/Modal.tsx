import { modalStyles } from "./Modal.styles";

type ModalType = keyof typeof modalStyles;

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  modalType: ModalType;
  className?: string;
}

export const Modal = ({
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
