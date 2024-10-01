import { useModal } from "@/shared/lib";
import { ExitConfirmModal } from "@/shared/ui/modal";
import { usePasswordChangeFormStore } from "../store";
import { PasswordChangeModal } from "../ui";

export const usePasswordChangeModal = () => {
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
