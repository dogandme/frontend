import type { useOverlay } from "@/shared/lib";
import { Button } from "../button";
import { CloseIcon } from "../icon";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  onConfirm?: () => void | Promise<void>;
  onClose: ReturnType<typeof useOverlay>["onClose"];
  children: React.ReactNode;
  confirmText?: string;
  closeText?: string;
  closeIconAriaLabel?: string;
  title?: string;
}

export const ConfirmModal = ({
  onConfirm,
  onClose,
  closeIconAriaLabel = "확인창 닫기",
  confirmText = "확인",
  closeText = "취소",
  title = "",
  children,
}: ConfirmModalProps) => {
  const navClassName = title ? "flex justify-between" : "flex justify-end";

  return (
    <Modal modalType="center">
      <nav className={navClassName}>
        {title && <h1 className="title-1 text-grey-900">{title}</h1>}
        <button aria-label={closeIconAriaLabel} onClick={onClose}>
          <CloseIcon />
        </button>
      </nav>
      <section className="text-grey-700 body-2">{children}</section>
      <div className="flex gap-2">
        <Button
          variant="text"
          colorType="tertiary"
          size="medium"
          fullWidth={false}
          className="flex-1"
          onClick={onClose}
        >
          {closeText}
        </Button>
        <Button
          variant="text"
          colorType="primary"
          size="medium"
          fullWidth={false}
          className="flex-1"
          onClick={async () => {
            await onConfirm?.();
            await onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
