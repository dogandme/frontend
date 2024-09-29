import type { useOverlay } from "@/shared/lib";
import { Button } from "../button";
import { CloseIcon } from "../icon";
import { Modal } from "./Modal";

interface StackedButtonModalProps {
  onClose: ReturnType<typeof useOverlay>["onClose"];
  children: React.ReactNode;
  closeIconAriaLabel?: string;
  title?: string;
  ConfirmButton?: JSX.Element;
  CloseButton?: JSX.Element;
  onConfirm?: () => void | Promise<void>;
  closeText?: string;
  confirmText?: string;
}

const DefaultConfirmButton = ({
  onClose,
  onConfirm,
  confirmText,
}: Pick<StackedButtonModalProps, "onClose" | "onConfirm" | "confirmText">) => {
  return (
    <Button
      variant="filled"
      colorType="primary"
      size="medium"
      onClick={async () => {
        onConfirm?.();
        onClose();
      }}
    >
      {confirmText}
    </Button>
  );
};

const DefaultCloseButton = ({
  onClose,
  closeText,
}: Pick<StackedButtonModalProps, "onClose" | "closeText">) => {
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
  closeIconAriaLabel = "모달 닫기",
  title = "",
  onClose,
  onConfirm = () => {},
  children,
  confirmText = "저장하기",
  closeText = "취소",
  ConfirmButton = (
    <DefaultConfirmButton
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={confirmText}
    />
  ),
  CloseButton = <DefaultCloseButton onClose={onClose} closeText={closeText} />,
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
        {ConfirmButton}
        {CloseButton}
      </div>
    </Modal>
  );
};
