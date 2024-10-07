import type { useOverlay } from "@/shared/lib";
import { Button } from "../button";
import { CloseIcon } from "../icon";
import { Modal } from "./Modal";

interface StackedButtonModalProps {
  onClose: ReturnType<typeof useOverlay>["onClose"];
  children: React.ReactNode;
  closeIconAriaLabel?: string;
  title?: string;
  onConfirm?: () => unknown | Promise<unknown>;
  confirmText?: string;
  closeText?: string;
}

const DefaultConfirmButton = ({
  onConfirm,
  confirmText,
}: {
  onConfirm: () => Promise<void>;
  confirmText: string;
}) => {
  return (
    <Button
      variant="filled"
      colorType="primary"
      size="medium"
      onClick={onConfirm}
    >
      {confirmText}
    </Button>
  );
};
const DefaultCloseButton = ({
  onClose,
  closeText,
}: {
  onClose: () => void;
  closeText: string;
}) => {
  return (
    <Button
      colorType="tertiary"
      size="medium"
      variant="text"
      type="button"
      onClick={onClose}
    >
      {closeText}
    </Button>
  );
};

export const StackedButtonModal = ({
  closeIconAriaLabel = "모달창 닫기",
  title = "",
  onClose,
  children,
  confirmText = "저장",
  closeText = "취소",
  onConfirm,
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
        <DefaultConfirmButton
          onConfirm={async () => {
            const confirmFlag = await onConfirm?.();
            if (confirmFlag) {
              return;
            }
            onClose();
          }}
          confirmText={confirmText}
        />
        <DefaultCloseButton onClose={onClose} closeText={closeText} />
      </div>
    </Modal>
  );
};
