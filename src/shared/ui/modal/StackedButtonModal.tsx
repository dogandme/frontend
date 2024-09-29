import type { useOverlay } from "@/shared/lib";
import { Button } from "../button";
import { CloseIcon } from "../icon";
import { Modal } from "./Modal";

type StackedButton = (onClose: () => Promise<void>) => JSX.Element;

interface StackedButtonModalProps<
  T extends StackedButton | undefined,
  K extends StackedButton | undefined,
> {
  onClose: ReturnType<typeof useOverlay>["onClose"];
  children: React.ReactNode;
  closeIconAriaLabel?: string;
  title?: string;
  ConfirmButton?: T;
  CloseButton?: K;
  onConfirm?: T extends StackedButton ? never : () => void;
  confirmText?: T extends StackedButton ? never : string;
  closeText?: K extends StackedButton ? never : string;
}

const DefaultConfirmButton = ({
  onClose,
  onConfirm,
  confirmText,
}: {
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}) => {
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
}: {
  onClose: () => void;
  closeText?: string;
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

export const StackedButtonModal = <
  T extends StackedButton | undefined,
  K extends StackedButton | undefined,
>({
  closeIconAriaLabel = "모달 닫기",
  title = "",
  onClose,
  children,
  confirmText,
  closeText,
  onConfirm,
  ConfirmButton,
  CloseButton,
}: StackedButtonModalProps<T, K>) => {
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
        {ConfirmButton ? (
          ConfirmButton(onClose)
        ) : (
          <DefaultConfirmButton
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText={confirmText || "저장"}
          />
        )}
        {CloseButton ? (
          CloseButton(onClose)
        ) : (
          <DefaultCloseButton
            onClose={onClose}
            closeText={closeText || "취소"}
          />
        )}
      </div>
    </Modal>
  );
};
