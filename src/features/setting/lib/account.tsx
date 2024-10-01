import { useModal } from "@/shared/lib";
import { ExitConfirmModal } from "@/shared/ui/modal";
import { useAccountCancellationFormStore } from "../store";
import { usePasswordChangeFormStore } from "../store";
import { PasswordChangeModal, PasswordCheckModal } from "../ui";

export const useCancellationCheckModal = () => {
  const resetAccountCancellationForm = useAccountCancellationFormStore(
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
        const { password } = useAccountCancellationFormStore.getState();
        if (password) {
          handleOpenExitConfirmModal();
          return true;
        }
      },
    },
  );
  return handleOpenCancellationCheckModal;
};

export const useChangePasswordModal = () => {
  const resetPasswordChangeForm = usePasswordChangeFormStore(
    (state) => state.reset,
  );

  const { handleOpen: handleOpenExitConfirmModal, onClose: onCloseExitModal } =
    useModal(() => (
      <ExitConfirmModal
        onClose={onCloseExitModal}
        onConfirm={() => {
          resetPasswordChangeForm();
          onClosePasswordChangeModal();
        }}
      />
    ));

  const {
    handleOpen: handleOpenPasswordChangeModal,
    onClose: onClosePasswordChangeModal,
  } = useModal(
    () => <PasswordChangeModal onClose={onClosePasswordChangeModal} />,
    {
      beforeClose: () => {
        const { currentPassword, newPassword, confirmPassword } =
          usePasswordChangeFormStore.getState();

        if (currentPassword || newPassword || confirmPassword) {
          handleOpenExitConfirmModal();
          return true;
        }
      },
    },
  );

  return handleOpenPasswordChangeModal;
};
