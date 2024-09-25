import type { useOverlay } from "@/shared/lib";
import { Button } from "../button";
import { CloseIcon } from "../icon";
import { Modal } from "./Modal";

interface StackedButtonModalProps {
  onConfirm?: () => void | Promise<void>;
  onClose: ReturnType<typeof useOverlay>["onClose"];
  children: React.ReactNode;
  confirmText?: string;
  closeText?: string;
  closeIconAriaLabel?: string;
  title?: string;
}

export const StackedButtonModal = ({
  onConfirm,
  onClose,
  closeIconAriaLabel = "확인창 닫기",
  confirmText = "확인",
  closeText = "취소",
  title = "",
  children,
}: StackedButtonModalProps) => {
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
        <Button
          variant="filled"
          colorType="primary"
          size="medium"
          onClick={async () => {
            await onConfirm?.();
            await onClose();
          }}
        >
          {confirmText}
        </Button>
        <Button
          colorType="tertiary"
          size="medium"
          variant="text"
          type="button"
          onClick={onClose}
        >
          {closeText}
        </Button>
      </div>
    </Modal>
  );
};
