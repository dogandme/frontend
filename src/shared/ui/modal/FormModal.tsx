import type { useOverlay } from "@/shared/lib";
import { CloseIcon } from "../icon";
import { Modal } from "./Modal";

interface FormModalProps {
  onClose: ReturnType<typeof useOverlay>["onClose"];
  children: React.ReactNode;
  closeIconAriaLabel?: string;
  title?: string;
  ConfirmButton: JSX.Element;
  CloseButton?: JSX.Element;
}

export const FormModal = ({
  onClose,
  closeIconAriaLabel = "확인창 닫기",
  title = "",
  children,
  ConfirmButton,
  CloseButton,
}: FormModalProps) => {
  const navClassName = title ? "flex justify-between" : "flex justify-end";

  return (
    <Modal modalType="center">
      <div className={navClassName}>
        {title && <h1 className="title-1 text-grey-900">{title}</h1>}
        <button aria-label={closeIconAriaLabel} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <section className="text-grey-700 body-2">{children}</section>
      <div className="flex flex-col gap-2 self-stretch">
        {ConfirmButton}
        {CloseButton}
      </div>
    </Modal>
  );
};
