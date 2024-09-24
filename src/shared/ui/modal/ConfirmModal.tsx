import { Button } from "../button";
import { CloseIcon } from "../icon";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  resolve?: () => void | Promise<void>;
  onCloseConfirmModal: () => void | Promise<void>;
  children: React.ReactNode;
  resolveText?: string;
  rejectText?: string;
  rejectAriaLabel?: string;
  title?: string;
}

export const ConfirmModal = ({
  resolve,
  onCloseConfirmModal,
  rejectAriaLabel = "확인창 닫기",
  resolveText = "확인",
  rejectText = "취소",
  title = "",
  children,
}: ConfirmModalProps) => {
  const navClassName = title ? "flex justify-between" : "flex justify-end";

  return (
    <Modal modalType="center">
      <nav className={navClassName}>
        {title && <h1 className="title-1 text-grey-900">{title}</h1>}
        <button aria-label={rejectAriaLabel} onClick={onCloseConfirmModal}>
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
          onClick={onCloseConfirmModal}
        >
          {rejectText}
        </Button>
        <Button
          variant="text"
          colorType="primary"
          size="medium"
          fullWidth={false}
          className="flex-1"
          onClick={async () => {
            await resolve?.();
            await onCloseConfirmModal();
          }}
        >
          {resolveText}
        </Button>
      </div>
    </Modal>
  );
};
