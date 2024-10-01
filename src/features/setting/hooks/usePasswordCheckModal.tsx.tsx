import { useModal } from "@/shared/lib";
import { ExitConfirmModal } from "@/shared/ui/modal";
import { usePasswordCheckFormStore } from "../store";
import { PasswordCheckModal } from "../ui";

export const usePasswordCheckModal = () => {
  const resetAccountCancellationForm = usePasswordCheckFormStore(
    (state) => state.reset,
  );

  const {
    handleOpen: handleOpenExitConfirmModal,
    onClose: onCloseConfirmModal,
  } = useModal(() => (
    <ExitConfirmModal
      onConfirm={() => {
        resetAccountCancellationForm();
        onCloseCancellationCheckModal();
      }}
      onClose={onCloseConfirmModal}
    />
  ));

  const {
    handleOpen: handleOpenCancellationCheckModal,
    onClose: onCloseCancellationCheckModal,
  } = useModal(
    () => <PasswordCheckModal onClose={onCloseCancellationCheckModal} />,
    {
      beforeClose: () => {
        const { password } = usePasswordCheckFormStore.getState();
        if (password) {
          handleOpenExitConfirmModal();
          return true;
        }
      },
    },
  );
  return handleOpenCancellationCheckModal;
};
